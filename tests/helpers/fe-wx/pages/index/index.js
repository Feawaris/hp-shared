const { BaseEnv, _console } = require('hp-shared/base.cjs');

Page({
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
        _console.log('success', res);
      },
    });
  },
  onLoad() {
    this.test();
  },
});
