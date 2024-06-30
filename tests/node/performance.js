const { BaseEnv, _console } = require('hp-shared/base');
const { MonitorInfo } = require('hp-shared/performance');

// const monitorInfo = new MonitorInfo();
// _console.log(monitorInfo);

describe('performance', () => {
  test('MonitorInfo', () => {
    const monitorInfo = new MonitorInfo();
    expect(monitorInfo).toEqual(expect.objectContaining({
      env: { envs: ['node'], os: BaseEnv.os, isMobile: false },
      location: { href: '' },
    }));
  });
});
