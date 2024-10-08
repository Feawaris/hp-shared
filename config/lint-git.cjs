const { CommitLint, GitHooks } = require('hp-shared');

const lint = new CommitLint({
  __filename,
  rootDir: '../',
});
const config = lint.merge(
  lint.baseConfig,
  {
    // ...
  },
);

const gitHooks = new GitHooks({
  __filename,
  rootDir: '../',
  config: {
    'commit-msg': [
      { styleName: 'yellow' },
      'npx commitlint --edit $1',
    ],
    'post-commit': [{ styleName: 'green' }],
  },
});

module.exports = {
  lint,
  config,
  gitHooks,
};
if (require.main === module) {
  gitHooks.updateFiles(GitHooks.HOOKS);
  lint
    .insertPackageJsonScripts({ name: 'lint:git' })
    .insertGitIgnoreFile()
    .createIgnoreFile()
    .createConfigFile(config);
}
