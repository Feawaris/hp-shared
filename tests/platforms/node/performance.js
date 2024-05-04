const { BaseEnv, _console } = require('hp-shared/base');
const { MonitorInfo } = require('hp-shared/performance');

// const monitorInfo = new MonitorInfo();
// _console.log(monitorInfo);

describe('BaseEnv', () => {
  test('MonitorInfo', () => {
    const monitorInfo = new MonitorInfo();
    expect(monitorInfo).toEqual(expect.objectContaining({
      _options: { uidName: 'monitor_id' },
      env: { envs: ['node'], os: BaseEnv.os },
      location: { href: '' },
    }));
  });
});
