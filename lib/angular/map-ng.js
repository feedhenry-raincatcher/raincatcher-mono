'use strict';

var mapClient = require('../client/mapClient');
module.exports = 'wfm.map';

angular
.module('wfm.map.services', ['wfm.core.mediator'])
.factory('mapClient', function() {
  return mapClient;
});

angular.module('wfm.map', [
  require('./directive'),
  'wfm.map.services'
]);
