import { BaseEnv, _console, _Date } from 'hp-shared/base';

Page({
  onLoad(query) {
    // _console.log(query);
    this.test();
  },
  test() {
    wx.request({
      url: 'http://localhost:9001/set-data',
      method: 'post',
      data: {
        platform: 'wx',
        data: {
          base: {
            BaseEnv,
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
      url: 'http://localhost:9001/error',
      method: 'post',
      success(res) {
        _console.log('success', res);
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
});
