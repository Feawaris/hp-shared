import { _console } from 'hp-shared/base';
import { Monitor } from 'hp-shared/performance';
const { default: { localConfig } } = require('tests-shared');

wx.appMonitor = new Monitor({
  reportUrl: `http://${localConfig.nwIP}:9001/performance`,
})
  .watchResourceError()
  .watchCodeError()
  .watchRequestError()
  .watchRouteChange();

App({});

