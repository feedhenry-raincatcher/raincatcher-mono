'use strict';
const shell = require('shelljs');
const basename = require('path').basename;
const glob = require('./util/array-glob.js');

exports.command = 'pr <modules..>';
exports.describe = 'PR changes on a subtree to git remotes';
exports.builder = {
  modules: {
    describe: 'Path of submodules to execute upon, can be a glob',
    type: 'string'
  },
  'remote-ref': {
    alias: 'r',
    type: 'string',
    describe: 'the remote branch/ref from which to PR to, defaults to the current branch'
  },
  'owner': {
    alias: 'o',
    describe: 'The owner of the fork for the PR head',
    type: 'string',
    default: 'feedhenry-raincatcher'
  },
  'base': {
    alias: 'b',
    describe: 'base fork to PR against',
    type: 'string',
    default: 'feedhenry-raincatcher'
  },
  'base-ref': {
    alias: 't',
    describe: 'base branch/ref to PR against',
    type: 'string',
    default: 'master'
  },
  'dry-run': {
    alias: 'n',
    type: 'boolean',
    describe: 'only output commands to console',
    default: false
  }
};
exports.handler = function(opts) {
  if (!shell.which('hub')) {
    throw new Error('This script requires the `hub` utility. See https://hub.github.com/');
  }
  let remoteRef = opts['remote-ref'] || shell.exec('git symbolic-ref --short HEAD', { silent: true }).stdout;
  remoteRef = remoteRef.trim();

  return glob(opts.modules, function(err, module) {
    if (err) {
      throw err;
    }
    let repo = basename(module);
    let gitCommand = `hub pull-request -b ${opts.base}/${repo}:${opts['base-ref']} -h ${opts.owner}/${repo}:${remoteRef}`;
    if (opts.n) {
      console.log(gitCommand);
    } else {
      shell.exec(gitCommand);
    }
  });

};