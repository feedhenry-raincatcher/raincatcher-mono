'use strict';
const Promise = require('bluebird');
let data = [
  {
    id: 'user1id',
    name: 'user1',
    address: 'Some Lane, Some Street, Some Country'
  }
];

exports.list = function() {
  return Promise.resolve(data);
};

exports.create = function(o) {
  data.push(o);
  return Promise.resolve(o);
};
