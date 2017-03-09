var CONSTANTS = require('./constants');

/**
 *
 * Controller for displaying Workorders on a Map
 *
 * @param {Mediator} mediator
 * @param {MapMediatorService} mapMediatorService
 * @constructor
 */
function MapController($scope, mediator, mapMediatorService) {
  $scope.workorders = [];

  mapMediatorService.listWorkorders().then(function(workorders) {
    $scope.workorders = workorders;
  });
}

angular.module(CONSTANTS.MAP_DIRECTIVE).controller('MapController', ['$scope', 'mediator', 'mapMediatorService', MapController]);