import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  projects: (() => {
    const args = (process.env.test_env || '').split(',').filter(val => val).map(val => val.trim());

    let result = [];
    if (args.includes('node')) {
      result.push({
        displayName: 'node',
        testEnvironment: 'node',
        testMatch: [
          '**/node/**/*.js',
        ],
      });
    }
    if (args.includes('browser')) {
      result.push({
        displayName: '浏览器',
        testEnvironment: 'node',
        testMatch: [
          '**/browser/**/*.js',
        ],
      });
    }
    if (args.includes('wx')) {
      result.push({
        displayName: '小程序',
        testEnvironment: 'node',
        testMatch: [
          '**/wx/**/*.js',
        ],
      });
    }
    return result;
  })(),
};
export default config;
