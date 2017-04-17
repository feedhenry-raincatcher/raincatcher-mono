'use strict';
const shell = require('shelljs');
const basename = require('path').basename;
const glob = require('./util/array-glob.js');

exports.command = 'pull <modules..>';
exports.describe = 'pull remote changes on a subtree to this tree';
exports.builder = {
  module: {
    describe: 'Submodule path to pull from',
    type: 'string'
  },
  'remote-ref': {
    alias: 'r',
    type: 'string',
    describe: 'the remote branch/ref from which to pull from, defaults to the current branch'
  },
  'owner': {
    alias: 'o',
    describe: 'use this to pull from a conventionally-named remote like {{my-fork}}-raincatcher-demo-cloud',
    type: 'string'
  },
  'squash': {
    alias: 's',
    type: 'boolean',
    describe: 'whether to squash the remote changes into a single commit',
    default: true
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

    let gitCommand = `git subtree pull --prefix="${module}" "${repo}" "${remoteRef}"`;
    if (opts.squash) {
      gitCommand = gitCommand + ' --squash';
    }
    if (opts.n) {
      return console.log(gitCommand);
    }
    shell.exec(gitCommand);
  });
};