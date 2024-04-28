const { _console } = require('hp-shared/base');

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
        this.data = await res.json();
      }
    }
    return this.data;
  }
}
const timeout = 60000;

module.exports = { TestData, timeout };


