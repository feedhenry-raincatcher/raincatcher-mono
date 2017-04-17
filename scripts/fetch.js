'use strict';
const shell = require('shelljs');
exports.command = 'fetch';
exports.describe = 'run a git fetch operation against all git remotes';
exports.builder = {
  async: {
    alias: 'n',
    describe: 'whether to run the `git fetch` processes asyncronously',
    default: true
  }
};
exports.handler = function(opts) {
  const remotes = shell.exec('git remote', { silent: true })
    .stdout
    .trim()
    .split('\n');

  remotes.forEach(r => shell.exec(`git fetch ${r}`, {async: opts.async}));
};