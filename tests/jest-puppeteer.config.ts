import { BaseEnv } from 'hp-shared/base';

export default {
  launch: {
    headless: true,
    executablePath: {
      mac: '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
      windows: String.raw`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`,
      linux: '',
    }[BaseEnv.os],
  },
};
