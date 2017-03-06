var CONSTANTS = require('./constants');

/**
 *
 * Controller for listing Workorders
 *
 * @param {Mediator} mediator
 * @param {MapMediatorService} mapMediatorService
 * @constructor
 */
function MapController(mediator, mapMediatorService) {
  var self = this;

  self.workorders = [];
  self.resultMap = {};

  mapMediatorService.listWorkorders().then(function(results) {
    self.workorders = results;
  });
}

angular.module(CONSTANTS.MAP_DIRECTIVE).controller('MapController', ['mediator', 'mapMediatorService', '$q', MapController]);