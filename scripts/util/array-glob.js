'use strict';
const glob = require('glob');

module.exports = function(patterns, fn) {
  if (!Array.isArray(patterns)) {
    patterns = [patterns];
  }
  try {
    patterns.reduce((globbed, p) => globbed.concat(glob.sync(p)), [])
    // call fn with the each found path and no error
    .forEach(fn.bind(null, null));
  } catch (e) {
    fn(e);
  }
};