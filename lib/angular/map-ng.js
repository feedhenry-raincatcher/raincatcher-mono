'use strict';

var client = require('../client/mapClient');
const MODULE_NAME = 'wfm.map.module';

module.exports = function(userConfig){
	userConfig = userConfig ? userConfig : {};

	angular
	.module(MODULE_NAME + '.services', ['wfm.core.mediator'])
	.factory('mapClient', function() {
	  return mapClient;
	});

	var mainModule = angular.module(MODULE_NAME, [
	  require('./directive'),
	  MODULE_NAME + '.services'
	]);
	require("./mobile.js")(mainModule, userConfig);
	require("./portal.js")(mainModule, userConfig);

	return MODULE_NAME;
};
