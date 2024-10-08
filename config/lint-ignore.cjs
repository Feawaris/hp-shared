const { _console, IgnoreLint } = require('hp-shared');
const md = require('./lint-md.cjs');
const css = require('./lint-css.cjs');
const js = require('./lint-js.cjs');
const prettier = require('./lint-prettier.cjs');
const git = require('./lint-git.cjs');

const gitignoreLint = new IgnoreLint({
  rootDir: '../',
  __filename,
  ignoreFile: '.gitignore',
});
const npmignoreLint = new IgnoreLint({
  rootDir: '../',
  __filename,
  ignoreFile: '.npmignore',
});
module.exports = { gitignoreLint, npmignoreLint };
if (require.main === module) {
  gitignoreLint
    .updateGroup({
      group: 'lint',
      data: [md, css, js, prettier, git]
        .map((obj) => [obj.lint.configFile, obj.lint.ignoreFile])
        .flat()
        .filter((val) => val?.trim() !== ''),
    })
    .formatFile();
  npmignoreLint
    .updateFile({
      data: [
        gitignoreLint.getText(),
        '# ---[manual] start---',
        'python',
        'harmony',
        '# ---[manual] end---',
      ],
      exclude: [{ tag: 'manual', group: 'npm:reserve' }],
    })
    .formatFile();
}
