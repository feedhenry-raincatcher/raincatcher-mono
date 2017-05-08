'use strict';
const resolve = require('path').resolve;
const glob = require('./util/array-glob.js');
const write = require('fs').writeFileSync;

exports.command = 'set-version <package> <version> <modules..>';
exports.describe = 'push changes on a subtree to git remotes';
exports.builder = {
  package: {
    describe: 'name of the package to adjust the version',
    type: 'string'
  },
  version: {
    describe: 'semver string of the package name',
    type: 'string'
  },
  modules: {
    describe: 'Path of submodules to execute upon, can be a glob',
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
  const pkg = opts.package;
  const version = opts.version;
  return glob(opts.modules, function(err, module) {
    if (err) {
      throw err;
    }
    let updated = false;
    const jsonPath = resolve(module, 'package.json');
    const pkgs = require(jsonPath);
    if (pkgs.dependencies && pkgs.dependencies[pkg]) {
      updated = pkgs.dependencies[pkg];
      pkgs.dependencies[pkg] = version;
    }
    if (pkgs.devDependencies && pkgs.devDependencies[pkg]) {
      updated = pkgs.devDependencies[pkg];
      pkgs.devDependencies[pkg] = version;
    }

    console.log('update version on module %s to %s, was %s', module, version, updated);
    if (updated && !opts.n) {
      write(jsonPath, JSON.stringify(pkgs, null, 2));
    }
  });
};