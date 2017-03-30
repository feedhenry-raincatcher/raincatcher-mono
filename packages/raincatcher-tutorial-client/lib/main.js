var angular = require('angular');

//Defining the module that that app will user.
//It is making use of the raincatcher-mediator module and
//raincatcher-tutorial module.
angular.module('example-raincatcher-app', [
  require('fh-wfm-mediator'),
  require('wfm-tutorial-module/lib/angular/example-ng')
]);

//These components below are specific to this app, but use Raincatcher functionality.

//Adding Templates
require('../dist');

//The controller for monitoring topics
require('./angular/eventMonitor/topicMonitor-controller');

//The directive for rendering the published topics.
require('./angular/eventMonitor/topicMonitor-directive');