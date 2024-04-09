const { _console } = require('hp-shared/base');
const { clipboard } = require('hp-shared/storage');
const { Command } = require('commander');
const program = new Command();
const { input, select, checkbox, confirm } = require('@inquirer/prompts');
const { version } = require('../package.json');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

program
  .name('hp-shared')
  .description('cli 工具')
  .version(version, '-v, --version', '版本号')
  .helpOption('-h, --help', '帮助')
  .action(function (options) {
    // _console.log('action', options);
    // 无参时默认显示帮助
    if (Object.keys(options).length === 0) {
      this.help();
    }
  });
program
  .command('init')
  .description('初始化配置')
  // .helpOption('-h, --help', 'init 帮助')
  .action(async function (options) {
    // _console.log('init action');
    const configDir = await input({ message: '输入配置文件存放目录', default: 'config' });
    const configDirAbsolute = path.resolve(process.cwd(), configDir);
    if (!fs.existsSync(configDirAbsolute)) {
      fs.mkdirSync(configDirAbsolute);
      _console.success(`${configDir} 目录已创建`);
    }
    const checkedLints = await checkbox({
      message: '选择 lint',
      choices: [
        { name: 'markdownlint', value: 'markdownlint', checked: true },
        { name: 'stylelint', value: 'stylelint', checked: true },
        { name: 'eslint', value: 'eslint', checked: true },
        { name: 'prettier', value: 'prettier', checked: true },
        { name: 'git', value: 'git', checked: true },
      ],
    });
    if (checkedLints.includes('markdownlint')) {
      await createLintFile({
        configDir,
        lintFile: 'lint-md.cjs',
        templateFile: './templates/lint-md.ejs',
      });
    }
    if (checkedLints.includes('stylelint')) {
      await createLintFile({
        configDir,
        lintFile: 'lint-css.cjs',
        templateFile: './templates/lint-css.ejs',
      });
    }
    if (checkedLints.includes('eslint')) {
      await createLintFile({
        configDir,
        lintFile: 'lint-js.cjs',
        templateFile: './templates/lint-js.ejs',
      });
    }
    if (checkedLints.includes('prettier')) {
      await createLintFile({
        configDir,
        lintFile: 'lint-prettier.cjs',
        templateFile: './templates/lint-prettier.ejs',
      });
    }
    if (checkedLints.includes('git')) {
      await createLintFile({
        configDir,
        lintFile: 'lint-git.cjs',
        templateFile: './templates/lint-git.ejs',
      });
    }
    // lint 命令加入到 package.json
    let pkg = require(path.resolve(process.cwd(), 'package.json'));
    pkg.scripts = pkg.scripts || {};
    await updateScript(
      pkg,
      'lint',
      (() => {
        const map = {
          markdownlint: 'pnpm run lint:md',
          stylelint: 'pnpm run lint:css',
          eslint: 'pnpm run lint:js',
          prettier: 'pnpm run lint:prettier',
          git: 'pnpm run lint:git',
        };
        return Object.entries(map)
          .filter(([key, value]) => checkedLints.includes(key))
          .map(([key, value]) => value)
          .join(' ; ');
      })(),
    );
    await updateScript(
      pkg,
      'lint:fix',
      (() => {
        const map = {
          markdownlint: 'pnpm run lint:md:fix',
          stylelint: 'pnpm run lint:css:fix',
          eslint: 'pnpm run lint:js:fix',
          prettier: 'pnpm run lint:prettier:fix',
          git: 'pnpm run lint:git',
        };
        return Object.entries(map)
          .filter(([key, value]) => checkedLints.includes(key))
          .map(([key, value]) => value)
          .join(' ; ');
      })(),
    );

    // 初始化安装
    const install = await select({
      message: `lint 相关依赖安装 + 初始化一次详细 lint`,
      choices: [
        { name: '执行', value: 'run' },
        { name: '复制命令，稍后执行', value: 'copy' },
        { name: '跳过', value: 'skip' },
      ],
    });
    const command = [
      'pnpm i -D',
      (() => {
        const map = {
          markdownlint: 'markdownlint-cli2',
          stylelint: 'stylelint postcss-html',
          eslint: 'eslint eslint-plugin-vue vue-eslint-parser typescript typescript-eslint prettier eslint-plugin-prettier',
          prettier: 'prettier',
          git: '@commitlint/cli husky',
        };
        return Object.entries(map)
          .filter(([key, value]) => checkedLints.includes(key))
          .map(([key, value]) => value)
          .join(' ');
      })(),
      '&& husky',
      ';',
      (() => {
        const map = {
          markdownlint: `node ${configDir}/lint-md.cjs`,
          stylelint: `node ${configDir}/lint-css.cjs`,
          eslint: `node ${configDir}/lint-js.cjs`,
          prettier: `node ${configDir}/lint-prettier.cjs`,
          git: `node ${configDir}/lint-git.cjs`,
        };
        return Object.entries(map)
          .filter(([key, value]) => checkedLints.includes(key))
          .map(([key, value]) => value)
          .join(' ; ');
      })(),
    ].join(' ');
    if (install === 'run') {
      const child = spawn(command, { shell: true });
      child.stdout.on('data', (data) => {
        console.log(`${data}`);
      });
      child.stderr.on('data', (data) => {
        console.error(`${data}`);
      });
      child.on('close', (code) => {
        _console.end(`子进程退出，退出码 ${code}`);
        _console.success('init 完成');
      });
    } else if (install === 'copy') {
      clipboard.copySync(command);
      _console.success('命令已复制，可粘贴执行');
      _console.success('init 完成');
    } else if (install === 'skip') {
      _console.success('init 完成');
    }
  });
program.parse(process.argv);

async function createLintFile({ configDir, lintFile, templateFile } = {}) {
  const outputFile = path.resolve(process.cwd(), configDir, lintFile);
  const newText = ejs.render(fs.readFileSync(path.resolve(__dirname, templateFile), 'utf-8'));
  if (fs.existsSync(outputFile)) {
    const oldText = fs.readFileSync(outputFile, 'utf-8');
    if (newText === oldText) {
      _console.end(`${path.join(configDir, lintFile)} 内容相同，无需替换`);
    } else {
      const replace = await confirm({ message: `${lintFile} 已有不同内容，是否替换？` });
      if (replace) {
        fs.writeFileSync(outputFile, newText);
        _console.warn(`${path.join(configDir, lintFile)} 已替换`);
      }
    }
  } else {
    fs.writeFileSync(outputFile, newText);
    _console.success(`${path.join(configDir, lintFile)} 已创建`);
  }
}
async function updateScript(pkg, name, value) {
  // _console.log(name, value);
  const packageFile = 'package.json';
  const oldValue = pkg.scripts[name] || '';
  if (value !== oldValue) {
    if (!pkg.scripts[name]?.trim()) {
      pkg.scripts[name] = value;
      fs.writeFileSync(path.resolve(process.cwd(), packageFile), `${JSON.stringify(pkg, null, 2)}\n`);
      _console.success(`${name} 命令已更新到: ${packageFile} ${path.resolve(process.cwd(), packageFile)}`);
    } else {
      const replace = await confirm({ message: `${name} 命令已有不同内容，是否替换？` });
      if (replace) {
        pkg.scripts[name] = value;
        fs.writeFileSync(path.resolve(process.cwd(), packageFile), `${JSON.stringify(pkg, null, 2)}\n`);
        _console.success(`${name} 命令已更新到: ${packageFile}`);
      }
    }
  } else {
    _console.end(`${packageFile} ${name} 无需更新`);
  }
}
