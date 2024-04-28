import { BaseEnv, _console } from 'hp-shared/base';

Object.assign(window, {
  BaseEnv, _console,
  async test() {
    const res = await fetch('http://localhost:9001/set-data', {
      method: 'post',
      body: JSON.stringify({
        platform: 'browser',
        data: {
          base: {
            BaseEnv,
          },
        },
      }),
    });
    const text = await res.text();
    _console.log(text);
  },
});
document.addEventListener('DOMContentLoaded', function () {
  window.test();
});
