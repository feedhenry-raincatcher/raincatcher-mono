'use strict';
let data = [
  {
    id: 'user1id',
    name: 'user1',
    address: 'Some Lane, Some Street, Some Country'
  }
];

exports.list = function() {
  return data;
};

exports.create = function(o) {
  data.push(o);
  return o;
};
