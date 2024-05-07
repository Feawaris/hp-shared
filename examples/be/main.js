const { _console, _Date } = require('hp-shared/base');
const { localConfig } = require('shared');
const http = require('node:http');
const EventEmitter = require('node:events');
const { MongoClient } = require('mongodb');

process.on('uncaughtException', (err) => {
  _console.error(err);
  process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
  _console.error(reason, promise);
  process.exit(1);
});

const dataStore = {
  browser: null,
  wx: null,
};
const eventBus = new EventEmitter();

async function getRequestBody(req) {
  // console.log('getRequestBody', req.body);
  if (req.body) {
    return req.body;
  }
  return new Promise((resolve, reject) => {
    let str = '';
    // 监听请求的 data 事件，拼接 POST 数据
    req.on('data', (chunk) => {
      str += chunk.toString();
    });
    // 监听请求的 end 事件，表示数据接收完毕
    req.on('end', () => {
      req.body = str ? JSON.parse(str) : {};
      resolve(req.body);
    });
  });
}
async function getRequest(req) {
  return {
    httpVersion: req.httpVersion,
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    method: req.method.toUpperCase(),
    url: req.method,
    socket: {
      remoteFamily: req.socket.remoteFamily,
      remoteAddress: req.socket.remoteAddress,
      remotePort: req.socket.remotePort,
      localFamily: req.socket.localFamily,
      localAddress: req.socket.localAddress,
      localPort: req.socket.localPort,
      bytesRead: req.socket.bytesRead,
      bytesWritten: req.socket.bytesWritten,
    },
    headers: req.headers,
    body: await getRequestBody(req),
  };
}
class Response {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }
  async setResponse({ status = 200, message = status === 200 ? '成功' : '失败', data = null } = {}) {
    const { req, res } = this;
    const success = 200 <= status && status < 300;
    res
      .writeHead(status)
      .end(JSON.stringify({
        _request: await getRequest(req),
        success,
        code: success ? 0 : -1,
        message,
        data,
      }));
  }
}
const server = http.createServer(async (req, res) => {
  // 设置 CORS 头部
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Expose-Headers', '*');
  res.setHeader('Content-Type', 'application/json;charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');

  // OPTIONS 预检请求处理
  if (req.method.toLowerCase() === 'options') {
    res.writeHead(200)
      .end();
    return;
  }

  // 显示简易请求信息
  const { httpVersion, method, url } = req;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  _console.log(`HTTP/${httpVersion}`, ip, method, url);

  // 数据库
  const { mongodb: { hostname, port, username, password } } = localConfig;
  const client = new MongoClient(`mongodb://${[username, password].join(':')}@${[hostname, port].join(':')}`);
  await client.connect();
  const db = client.db('tests');

  // routes
  if (url === '/') {
    await new Response(req, res).setResponse();
  }
  // 随机错误测试
  if (url === '/error') {
    const getRandomCode = () => {
      const codes = [
        400, 401, 403, 404,
        500, 501, 502,
      ];
      return codes[Math.floor(Math.random() * codes.length)];
    };
    const { code = getRandomCode() } = await getRequestBody(req);
    new Response(req, res).setResponse({ status: code });
  }
  // 稳定性监控用 /performance[?type=xx]
  if (method === 'POST' && /^\/performance(\?.*)?$/.test(url)) {
    const body = await getRequestBody(req);
    const dbRes = await db.collection('monitor').insertOne({
      ip,
      createTime: `${new _Date().toString('YYYY-MM-DD HH:mm:ss.SSS')}`,
      ...body,
    });
    const _id = dbRes.insertedId.toString();
    _console.success('insertOne:', _id);
    await new Response(req, res).setResponse({ data: _id });
  }
  // jest 测试用
  if (method === 'POST' && url === '/set-data') {
    const { platform, data } = await getRequestBody(req);
    // 保存数据
    dataStore[platform] = data;
    eventBus.emit('set-data');
    // 返回响应
    await new Response(req, res).setResponse({
      message: `${platform} 完成`,
    });
  }
  if (method === 'POST' && url === '/get-data') {
    const { platform } = await getRequestBody(req);
    if (dataStore[platform]) {
      _console.success(`${platform} 数据已添加，直接返回`);
      await new Response(req, res).setResponse({
        data: dataStore[platform],
      });
    } else {
      _console.log(`${platform} 数据首次添加，等待 ${platform} 返回...`);
      eventBus.once('set-data', async () => {
        await new Response(req, res).setResponse({
          data: dataStore[platform],
        });
      });
    }
  }
});
server.listen(9001, '0.0.0.0', () => {
  _console.success('后端服务已开启：');
  console.log(`http://localhost:9001`);
});

