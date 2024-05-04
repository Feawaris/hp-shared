const { _console } = require('hp-shared/base');
const fs = require('node:fs');
const path = require('node:path');

// 更新 package.json
const pkg = require('../package.json');
const newPkg = {
  ...pkg,
  exports: {
    // 根路径
    '.': {
      browser: {
        import: './dist/browser/index.js',
        script: './dist/browser/index-umd.js',
      },
      node: {
        import: './dist/node/index.mjs',
        require: './dist/node/index.js',
      },
    },
    // 各模块
    ...(() => {
      const src = fs.readdirSync(path.resolve(__dirname, '../src'));
      const srcDirs = src.filter(val => fs.statSync(path.resolve(__dirname, `../src/${val}`)).isDirectory());
      return Object.fromEntries(srcDirs.map((val) => {
        return [
          `./${val}`,
          {
            browser: {
              import: `./dist/browser/${val}.js`,
            },
            node: {
              import: `./dist/node/${val}.mjs`,
              require: `./dist/node/${val}.js`,
            },
          },
        ];
      }));
    })(),
    // 其他
    './*': './*',
  },
};
const oldText = JSON.stringify(pkg);
const newText = JSON.stringify(newPkg);
// _console.log(newText === oldText);
if (newText === oldText) {
  _console.end(`package.json: 无需更新`);
} else {
  fs.writeFileSync(path.resolve(__dirname, '../package.json'), JSON.stringify(newPkg, null, 2));
  _console.success(`package.json: 文件已更新`);
}
