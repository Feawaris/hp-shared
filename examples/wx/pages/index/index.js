import { useNodeGlobals } from 'hp-shared/base.node';
import { BaseEnv, _console, _Date, exit, restart } from 'hp-shared/base';
import { clipboard } from 'hp-shared/storage';
const { default: { localConfig } } = require('shared');
let __filename = '', __dirname = '';

Page({
  onLoad(query) {
    // _console.log(query);
    // 反馈给 jest 测试用
    // this.test();
    ({ __filename, __dirname } = useNodeGlobals());
    _console.log({ __filename, __dirname });
  },
  // 反馈给 jest 测试用
  async test() {
    const text = `你好，js:wx:copy,paste`;
    const textWrite = await clipboard.copy(text);
    const textRead = await clipboard.paste();
    wx.request({
      url: `${localConfig.remoteURL}/set-data`,
      method: 'post',
      data: {
        platform: 'wx',
        data: {
          base: {
            BaseEnv,
            node: { __filename, __dirname },
          },
          storage: {
            clipboard: {
              text, textWrite, textRead,
            },
          },
        },
      },
      success(res) {
        _console.success('success', res);
      },
    });
  },
  requestError() {
    wx.request({
      url: `${localConfig.remoteURL}/error`,
      method: 'post',
      success(res) {
      },
    });
  },
  codeError() {
    const a = 1;
    a = 2;
  },
  goHome() {
    wx.navigateTo({ url: `/pages/index/index?date=${new _Date()}` });
  },
  goPage1() {
    wx.navigateTo({ url: `/pages/page1/page1?date=${new _Date()}` });
  },
  onImageError(e) {
    _console.log(e);
  },
  exit() {
    exit();
  },
  restart() {
    restart();
  },
});
