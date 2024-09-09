const { BaseEnv, _console, MonitorInfo } = require('hp-shared');

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
