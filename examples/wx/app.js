import { _console } from 'hp-shared/base';
import { Monitor } from 'hp-shared/performance';
const { default: { localConfig } } = require('shared');

wx.appMonitor = new Monitor({
  reportUrl: `${localConfig.remoteURL}/performance`,
})
  .watchResourceError()
  .watchCodeError()
  .watchRequestError()
  .watchRouteChange();

App({});

