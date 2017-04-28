'use strict';
const underTest = require('./index');
const assert = require('assert');
const Promise = require('bluebird');

var tests = [];

tests.push(underTest.list().then(function(list) {
  assert(Array.isArray(list));
  assert.equal(list.length, 1);
}));

tests.push(underTest.create({ name: 'trever', address: 'Somewhere only we know' }));

Promise.all(tests).then(() =>
  underTest.client.quit());