import { BaseConsole } from '../base';

export const _console = BaseConsole.create({
  jsEnv: 'node',
  dirOptions: {
    depth: 0,
    showHidden: true,
    colors: true,
  },
});
