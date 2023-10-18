/**
 * 1.koa
 */
// koa: https://github.com/demopark/koa-docs-Zh-CN
const Koa = require('koa');
const app = new Koa();
/**
 * 2.中间件使用
 */
// 输出资源请求信息
app.use(async (ctx, next) => {
  const label = `${ctx.method} ${ctx.url}`;
  console.time(label);
  await next();
  console.timeEnd(label);
});
// 设置跨域。https://www.npmjs.com/package/@koa/cors
const cors = require('@koa/cors');
app.use(cors());
// koa-static 静态资源服务。https://github.com/koajs/static
const serve = require('koa-static');
app.use(serve('./'));
// koa-body。https://www.npmjs.com/package/koa-body
const { koaBody } = require('koa-body');
app.use(koaBody());
/**
 * 3.各项目路由、接口
 */
// @koa/router 路由。https://github.com/koajs/router
const Router = require('@koa/router');
const router = new Router();
// 根路径各路由
router.get('/', (ctx, next) => {
  ctx.body = `<h1>Node后端服务已开启！</h1>`;
});

// http状态码测试
const { STATUSES } = require('hp-shared/network');
// shared：路径用于基础库测试
router.all('/api/shared/network/statuses', (ctx) => {
  console.log(ctx.request.query);
  const status = Number.parseInt(ctx.request.query.status);
  ctx.status = status;
  ctx.body = STATUSES.find(obj => obj.status === status);
});
// use router
app.use(router.routes())
  .use(router.allowedMethods());
/**
 * 4.开启服务
 */
// 端口配置
const ports = {
  http: 36300,
  https: 36400,
  both: 36500,
};
const { WebSocketServer } = require('ws');
// http方式：http、ws
const http = require('http');
(function useHttp() {
  const server = http.createServer(app.callback());
  const wsServer = new WebSocketServer({ server });
  wsServer.on('connection', function(ws) {
    ws.on('message', function(data) {
      console.log('ws 接收数据: ', data);
      this.send(Date.now());
    });
  });
  server.listen(ports.http);
})();
// http方式：https、wss
const https = require('https');
const fs = require('fs');
const path = require('path');
(function useHttps() {
  const server = https.createServer({
    key: fs.readFileSync(path.resolve(__dirname, 'server.key')),
    cert: fs.readFileSync(path.resolve(__dirname, 'server.crt')),
  }, app.callback());
  const wsServer = new WebSocketServer({ server });
  wsServer.on('connection', function(ws) {
    ws.on('message', function(data) {
      console.log('wss 接收数据: ', data);
      this.send(Date.now());
    });
  });
  server.listen(ports.https);
})();
// http和https共用。https://www.cnblogs.com/dojo-lzz/p/5479870.html
const net = require('net');
(function useBoth() {
  net.createServer(function(socket) {
    socket.once('data', function(buf) {
      // https数据流的第一位是十六进制“16”，转换成十进制就是22
      const address = buf[0] === 0x16 ? ports.https : ports.http;
      // 创建一个指向https或http服务器的链接
      const proxy = net.createConnection(address, function() {
        proxy.write(buf);
        // 反向代理的过程，tcp接受的数据交给代理链接，代理链接服务器端返回数据交由socket返回给客户端
        socket.pipe(proxy).pipe(socket);
      });
      proxy.on('error', function(e) {
        console.error('proxy error', e);
      });
    });
    socket.on('error', function(e) {
      console.error('socket error', e);
    });
  }).listen(ports.both);
})();
// 表格方式显示可用地址
console.log('后端服务已开启：');
const os = require('os');
(function show() {
  const ipv4List = Object.values(os.networkInterfaces()).flat()
    .filter(obj => obj.family.toLowerCase() == 'ipv4');
  // console.log(ipv4List);
  // console.table加强显示，格式：{'localhost':{http,https,ws,wss},{'127.0.0.1':{http,https,ws,wss},...}}
  const hosts = ['localhost', ...ipv4List.map(obj => obj.address)];
  const entries = hosts.map((host) => {
    return [
      host,
      // 格式：{http,https,ws,wss}
      Object.fromEntries(['http', 'https', 'ws', 'wss'].map((protocol) => {
        return [
          protocol,
          `${protocol}://${host}:${ports.both}`,
        ];
      })),
    ];
  });
  const obj = Object.fromEntries(entries);
  // console.log(obj);
  console.table(obj);
})();
