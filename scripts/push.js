'use strict';
const shell = require('shelljs');
const basename = require('path').basename;
const glob = require('./util/array-glob.js');

exports.command = 'push <modules..>';
exports.describe = 'push changes on a subtree to git remotes';
exports.builder = {
  modules: {
    describe: 'Path of submodules to execute upon, can be a glob',
    type: 'string'
  },
  'remote-ref': {
    alias: 'r',
    type: 'string',
    describe: 'the remote branch/ref from which to push to, defaults to the current branch'
  },
  'owner': {
    alias: 'o',
    describe: 'use this to push to a conventionally-named remote like {{my-fork}}-raincatcher-demo-cloud',
    type: 'string'
  },
  'dry-run': {
    alias: 'n',
    type: 'boolean',
    describe: 'only output commands to console',
    default: false
  }
};
exports.handler = function(opts) {
  let remoteRef = opts['remote-ref'] || shell.exec('git symbolic-ref --short HEAD', { silent: true }).stdout;
  remoteRef = remoteRef.trim();

  return glob(opts.modules, function(err, module) {
    if (err) {
      throw err;
    }
    let repo = basename(module);
    if (opts.owner) {
      repo = `${opts.owner}-${repo}`;
    }
    let gitCommand = `git subtree push --prefix="${module}" "${repo}" "${remoteRef}"`;
    if (opts.n) {
      console.log(gitCommand);
    } else {
      shell.exec(gitCommand);
    }
  });
};