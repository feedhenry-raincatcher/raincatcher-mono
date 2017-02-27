'use strict';

module.exports = function(mainModule, userConfig) {
  mainModule.config(function($stateProvider) {
    if (userConfig && !userConfig.mobile) {
      return;
    }

    $stateProvider
      .state('app.map', {
        url: '/map',
        resolve: {
          workorders: function(workorderManager) {
            return workorderManager.list();
          }
        },
        template: '<div class="map" flex><workorder-map workorders="ctrl.workorders" center="ctrl.center"></workorder-map></div>',
        controller: 'MapCtrl as ctrl'
      });
  });

  mainModule.controller('MapCtrl', function($window, $document, $timeout, workorders) {
    this.center = [49.28, -123.12];
    this.workorders = workorders;
  });
};