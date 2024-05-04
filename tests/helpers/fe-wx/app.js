import { _console } from 'hp-shared/base';
import { Monitor } from 'hp-shared/performance';

wx.appMonitor = new Monitor()
  .watchResourceError()
  .watchCodeError()
  .watchRequestError()
  .watchRouteChange();

App({});
