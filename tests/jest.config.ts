import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  projects: [
    {
      displayName: 'node',
      testEnvironment: 'node',
      testMatch: [
        '**/platforms/node/**/*.js',
      ],
    },
    {
      displayName: '浏览器',
      testEnvironment: 'node',
      testMatch: [
        '**/platforms/browser/**/*.js',
      ],
    },
    {
      displayName: '小程序',
      testEnvironment: 'node',
      testMatch: [
        '**/platforms/wx/**/*.js',
      ],
    },
  ],
};
export default config;
