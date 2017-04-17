'use strict';
const shell = require('shelljs');
const basename = require('path').basename;

exports.command = 'add-remotes [owner]';
exports.describe = 'add conventionally-named git remotes to this clone';
exports.builder = {
  owner: {
    type: 'string',
    describe: 'The github org or user that owns the remote',
    default: 'feedhenry-raincatcher'
  },
  n: {
    alias: 'dry-run',
    type: 'boolean'
  }
};
exports.handler = function(opts) {
  const repoDirs = shell.ls('-d', ['apps/*' , 'packages/*']);

  repoDirs.forEach(function(dir) {
    const name = basename(dir);
    const remote = `git@github.com:${opts.owner}/${name}.git`;
    if (opts.n) {
      return console.log(dir, remote);
    }
    shell.exec(`git remote add ${opts.owner}-${name} ${remote}`, { async: true });
  });
};