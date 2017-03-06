var CONSTANTS = require('./constants');

angular.module(CONSTANTS.MAP_DIRECTIVE).config(['$stateProvider', function($stateProvider) {

  var mapStateConfig = {
    url: '/map',
    data: {
      columns: 2
    },
    views: {
      content: {
        template: '<workorder-map workorders="ctrl.workorders" center="ctrl.center" container-selector="#content"></workorder-map>',
        controller: 'MapController as ctrl'
      }
    }
  };
  $stateProvider.state('app.map', mapStateConfig);
}]);