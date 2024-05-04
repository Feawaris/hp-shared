class TestData {
  constructor(platform) {
    this.platform = platform;

    this.data = null;
  }

  async getData() {
    if (!this.data) {
      const res = await fetch(`http://localhost:9001/get-data`, {
        method: 'post',
        body: JSON.stringify({
          platform: this.platform,
        }),
      });
      if (res.status === 200) {
        this.data = (await res.json()).data;
      }
    }
    return this.data;
  }
}
const timeout = 60000;
// 本地配置信息，不进行 git 提交
const localConfig = (function getLocalConfig() {
  try {
    return require('../config.local');
  } catch (e) {
    // 没有文件时使用演示数据
    return {
      // 数据库配置
      mongodb: {
        hostname: 'localhost',
        port: 27017,
        username: '',
        password: '',
      },
      // 内网 ip，小程序真机调试用
      nwIP: 'localhost',
    };
  }
})();

module.exports = { TestData, timeout, localConfig };


