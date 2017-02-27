'use strict';

module.exports = function(mainModule, userConfig){
  mainModule.config(function($stateProvider) {
    if(userConfig && userConfig.mobile) {
      return
    }

    $stateProvider
      .state('app.map', {
        url: '/map',
        resolve: {
          workorders: function(workorderManager) {
            return workorderManager.list();
          }
        },
        data: {
          columns: 2
        },
        views: {
          content: {
            template: '<workorder-map workorders="ctrl.workorders" center="ctrl.center" container-selector="#content"></workorder-map>',
            controller: 'MapCtrl as ctrl'
          }
        }
      });
  });

  mainModule.controller('MapCtrl', function($window, $document, $timeout, workorders) {
    this.center = [49.28, -123.08];
    this.workorders = workorders;
  });
};



