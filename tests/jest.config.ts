import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  projects: [
    {
      displayName: 'node 端测试',
      testEnvironment: 'node',
      testMatch: [
        '**/node/**/*.ts',
      ],
    },
    {
      preset: 'jest-puppeteer',
      displayName: 'browser 端测试',
      testMatch: [
        '**/browser/**/*.ts',
      ],
    },
  ],
};
export default config;
