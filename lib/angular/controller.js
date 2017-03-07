var CONSTANTS = require('./constants');

/**
 *
 * Controller for displaying Workorders on a Map
 *
 * @param {Mediator} mediator
 * @param {MapMediatorService} mapMediatorService
 * @constructor
 */
function MapController(mediator, mapMediatorService) {
  var self = this;

  self.workorders = [];
  self.resultMap = {};

  mapMediatorService.listWorkorders().then(function(workorders) {
    self.workorders = workorders;
  });
}

angular.module(CONSTANTS.MAP_DIRECTIVE).controller('MapController', ['mediator', 'mapMediatorService', MapController]);