const { _console } = require('hp-shared/base');
const http = require('node:http');
const EventEmitter = require('node:events');

const dataStore = {
  browser: null,
  wx: null,
};
const eventBus = new EventEmitter();
eventBus.on('set-data', ({ platform, data } = {}) => {
  dataStore[platform] = data;
});

async function getBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    // 监听请求的 data 事件，拼接 POST 数据
    req.on('data', (chunk) => {
      data += chunk.toString();
    });
    // 监听请求的 end 事件，表示数据接收完毕
    req.on('end', () => {
      data = JSON.parse(data);
      resolve(data);
    });
  });
}
const server = http.createServer(async (req, res) => {
  // 设置 CORS 头部
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  // OPTIONS 预检请求处理
  if (req.method.toLowerCase() === 'options') {
    res.writeHead(200)
      .end();
    return;
  }

  _console.log(req.method, req.url);
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('root ok');
  }
  if (req.method.toLowerCase() === 'post' && req.url === '/set-data') {
    const { platform, data } = await getBody(req);
    // 保存数据
    eventBus.emit('set-data', { platform, data });
    // 返回响应
    res.writeHead(200)
      .end(`${platform} end`);
  }
  if (req.method.toLowerCase() === 'post' && req.url === '/get-data') {
    const { platform } = await getBody(req);
    if (dataStore[platform]) {
      _console.success(`${platform} 数据已添加，直接返回`);
      res.writeHead(200)
        .end(JSON.stringify(dataStore[platform]));
    } else {
      _console.log(`${platform} 数据首次添加，等待 ${platform} 返回...`);
      eventBus.once('set-data', () => {
        res.writeHead(200)
          .end(JSON.stringify(dataStore[platform]));
      });
    }
  }
});
server.listen(9001, () => {
  _console.success('后端服务已开启：');
  console.log(`http://localhost:9001`);
});

