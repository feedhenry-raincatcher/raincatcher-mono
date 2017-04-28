'use strict';
var redis = require('redis');
var Promise = require('bluebird');
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

var client = redis.createClient();
function uid() {
  return require('crypto').randomBytes(16).toString('hex');
}
function setUser(u) {
  u.id = u.id || uid();
  return client.multi()
    .hset('user:' + u.id, 'name', u.name)
    .hset('user:' + u.id, 'address', u.address)
    .sadd('user:ids', u.id)
    .tap(redis.print);
}

let data = [
  {
    id: 'user1id',
    name: 'user1',
    address: 'Some Lane, Some Street, Some Country'
  }
];

data.forEach(setUser);

exports.list = function() {
  return client.smembersAsync('user:ids')
    .map(id => client.hgetallAsync('user:' + id));
};

exports.create = function(o) {
  setUser(o);
  return o;
};
