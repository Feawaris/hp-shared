import { _console, _Date } from 'hp-shared/base';

Page({
  onLoad(query) {
    // _console.log(query);
  },
  goHome() {
    wx.navigateTo({ url: `/pages/index/index?date=${new _Date()}` });
  },
  reLaunch() {
    wx.reLaunch({ url: `/pages/index/index?date=${new _Date()}` });
  },
  redirectTo() {
    wx.redirectTo({ url: `/pages/index/index?date=${new _Date()}` });
  },
  navigateTo() {
    wx.navigateTo({ url: `/pages/index/index?date=${new _Date()}` });
  },
  navigateBack() {
    wx.navigateBack({ url: `/pages/index/index?date=${new _Date()}` });
  },
});
