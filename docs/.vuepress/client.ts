// import { Monitor } from 'hp-shared';
// import pkg from 'hp-shared/package.json' assert { type: 'json' };
import { defineClientConfig } from 'vuepress/client';

export default defineClientConfig({
  enhance({ app, router, siteData }) {
    /*const appMonitor = new Monitor({
      reportUrl: `https://tests.vip.cpolar.cn/performance`,
      appInfo: {
        name: 'docs',
        version: pkg.version,
      },
    }).watchResourceError()
      .watchCodeError()
      .watchPromiseError()
      .watchRequestError()
      .watchRouteChange()
      .watchVueError(app);*/
  },
  setup() {},
  rootComponents: [],
});
