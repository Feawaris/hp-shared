import { BaseEnv, _console, _Date } from 'hp-shared/base';
import { clipboard } from 'hp-shared/storage';
const { default: { localConfig } } = require('shared');

Page({
  onLoad(query) {
    // _console.log(query);
    // 反馈给 jest 测试用
    // this.test();
  },
  // 反馈给 jest 测试用
  async test() {
    const copyText = `wx:copy`;
    const copyTextRes = await clipboard.copy(copyText);
    const pasteText = `wx:paste`;
    await clipboard.copy(pasteText);
    const pasteTextRes = await clipboard.paste();
    wx.request({
      url: `${localConfig.remoteURL}/set-data`,
      method: 'post',
      data: {
        platform: 'wx',
        data: {
          base: {
            BaseEnv,
          },
          storage: {
            clipboard: {
              copyText, copyTextRes,
              pasteText, pasteTextRes,
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
    wx.navigateTo({ url: `/pages/index/index?date=${new _Date}` });
  },
  goPage1() {
    wx.navigateTo({ url: `/pages/page1/page1?date=${new _Date}` });
  },
  onImageError(e){
    _console.log(e);
  }
});
