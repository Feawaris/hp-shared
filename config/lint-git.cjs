const { CommitLint, GitHooks } = require('hp-shared/dev');

const lint = new CommitLint({
  __filename,
  rootDir: '../',
  configFile: 'commitlint.config.cjs',
});
const config = lint.merge(lint.baseConfig, {
  // ...
});

const gitHooks = new GitHooks({
  __filename,
  rootDir: '../',
  huskyDir: '.husky',
  config: {
    'commit-msg': [
      { styleName: 'yellow' },
      'npx commitlint --edit $1',
    ],
    'post-commit': [
      { styleName: 'green' },
    ],
  },
});

module.exports = {
  lint,
  config,
  gitHooks,
};
if (require.main === module) {
  // _console.dir(gitHooks, { depth: Infinity });
  gitHooks.updateFiles(GitHooks.HOOKS);
  lint
    .insertPackageJsonScripts(lint.scriptName, ({ filenameRelative }) => {
      return `node ${filenameRelative} && echo 'feat: test' | commitlint || true`;
    })
    .insertGitIgnoreFile()
    .createIgnoreFile()
    .createConfigFile(config);
}
