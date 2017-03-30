'use strict';

var angular = require('angular');
var _ = require('lodash');
//Requiring the client SDK with Drag & Drop Apps Functionality.
window.async = require('async');
window._ = require('underscore');
require('fh-js-sdk/dist/feedhenry-forms.js');
var $fh = require('fh-js-sdk');
var config = require('./config.json');

var workorderCore = require('fh-wfm-workorder/lib/client');
var workflowCore = require('fh-wfm-workflow/lib/client');
var resultCore = require('fh-wfm-result/lib/client');
var fileCore = require('fh-wfm-file/lib/client');

angular.module('wfm-mobile', [
  require('angular-messages')
, require('angular-ui-router')
, require('angular-material')
, require('fh-wfm-sync')
, require('fh-wfm-message')
, require('fh-wfm-mediator')
, require('fh-wfm-workorder-angular')({
  mode: "user",
  mainColumnViewId: "content@app"
})
, require('fh-wfm-workflow-angular')({
  mode: "user",
  mainColumnViewId: "content@app",
  toolbarViewId: "toolbar@app"
})
, require('fh-wfm-appform')
, require('fh-wfm-risk-assessment')
, require('fh-wfm-vehicle-inspection')
, require('fh-wfm-user')
, require('fh-wfm-map')
, require('fh-wfm-camera')
, require('./message/message')
, require('./map/map')
, require('./setting/setting')
, require('./auth/auth')
, require('./calendar/calendar')
, require('fh-wfm-file-angular')({
  userMode: true,
  uploadEnabled: true,
  mainColumnViewId: "content",
  detailStateMount: "app.file-detail"
})
])

.config(function($stateProvider, $urlRouterProvider) {
  // if none of the states are matched, use this as the fallback
  //TODO: This should be a state.go call...
  $urlRouterProvider.otherwise('/workorders/list');

  $stateProvider
    .state('app', {
      abstract: true,
      templateUrl: 'app/main.tpl.html',
      resolve: {
        profileData: function(userClient) {
          return userClient.getProfile();
        },
        syncManagers: function(syncPool, profileData) {
          return syncPool.syncManagerMap(profileData);
        },
        workorderManager: function(syncManagers) {
          return syncManagers.workorders;
        },
        workflowManager: function(syncManagers) {
          return syncManagers.workflows;
        },
        messageManager: function(syncManagers) {
          return syncManagers.messages;
        }
      },
      controller: function($rootScope, $scope, $state, $mdSidenav, mediator, profileData) {
        $scope.profileData = profileData;
        $scope.toggleSidenav = function(event, menuId) {
          $mdSidenav(menuId).toggle();
          event.stopPropagation();
        };
        $scope.navigateTo = function(state, params) {
          if (state) {
            $state.go(state, params);
          }
        };
      }
    });
})

.run(function($rootScope, $state, mediator, syncPool) {
  mediator.subscribe('wfm:auth:profile:change', function(_profileData) {
    if (_profileData === null) { // a logout
      syncPool.removeManagers().then(function() {
        $state.go('app.login', undefined, {reload: true});
      }, function(err) {
        console.err(err);
      });
    } else {
      syncPool.syncManagerMap(_profileData)  // created managers will be cached
      .then(syncPool.forceSync)
      .then(function() {
        if ($rootScope.toState) {
          $state.go($rootScope.toState, $rootScope.toParams, {reload: true});
          delete $rootScope.toState;
          delete $rootScope.toParams;
        } else {
          $state.go('app.workorder', undefined, {reload: true});
        }
      });
    }
  });
})

.factory('syncPool', function($q, $state, mediator, workorderSync, workflowSync, messageSync, syncService) {
  var syncPool = {};

  //Initialising the sync service - This is the global initialisation
  syncService.init(window.$fh, config.syncOptions);

  syncPool.removeManagers = function() {
    var promises = [];
    // add any additonal manager cleanups here
    // TODO: replace this with a mediator event that modules can listen for
    promises.push(workorderSync.removeManager());
    promises.push(messageSync.removeManager());
    promises.push(workflowSync.removeManager());
    return $q.all(promises);
  };

  syncPool.syncManagerMap = function(profileData) {
    if (! profileData) {
      return $q.when({});
    }
    var promises = [];
    if (profileData && profileData.id) {
      var filter = {
        key: 'assignee',
        value: profileData.id
      };
      var messageFilter = {
        key: 'receiverId',
        value: profileData.id
      };
    }
    // add any additonal manager creates here
    promises.push(workorderSync.createManager());
    promises.push(workflowSync.createManager());
    promises.push(messageSync.createManager());

    //Initialisation of sync data sets to manage.
    return syncService.manage(config.datasetIds.workorders, {}, {filter: filter}, config.syncOptions)
      .then(syncService.manage(config.datasetIds.workflows, {}, {}, config.syncOptions))
      .then(syncService.manage(config.datasetIds.results, {}, {}, config.syncOptions))
      .then(syncService.manage(config.datasetIds.messages, {}, {filter: messageFilter}, config.syncOptions))
      .then(function() {
        return $q.all(promises).then(function(managers) {
          var map = {};
          managers.forEach(function(managerWrapper) {
            map[managerWrapper.manager.datasetId] = managerWrapper;
            managerWrapper.start(); //start sync
          });
          map.workorders.manager.publishRecordDeltaReceived(mediator);
          return map;
        });
      });
  };

  syncPool.forceSync = function(managers) {
    var promises = [];
    _.forOwn(managers, function(manager) {
      promises.push(
        manager.forceSync()
          .then(manager.waitForSync)
          .then(function() {
            return manager;
          })
      );
    });
    return $q.all(promises);
  };

  return syncPool;
}).run(function(mediator) {
  workorderCore(mediator);
  workflowCore(mediator);
  resultCore(mediator);
  fileCore(mediator,{},$fh);
})

.run(function($rootScope, $state, $q, mediator, userClient) {
  var initPromises = [];
  var initListener = mediator.subscribe('promise:init', function(promise) {
    initPromises.push(promise);
  });
  mediator.publish('init');
  console.log(initPromises.length, 'init promises to resolve.');
  var all = (initPromises.length > 0) ? $q.all(initPromises) : $q.when(null);
  all.then(function() {
    $rootScope.ready = true;
    console.log(initPromises.length, 'init promises resolved.');
    mediator.remove('promise:init', initListener.id);
    return null;
  });

  $rootScope.$on('$stateChangeStart', function(e, toState, toParams) {
    if (toState.name !== "app.login") {
      userClient.hasSession().then(function(hasSession) {
        if (!hasSession) {
          e.preventDefault();
          $rootScope.toState = toState;
          $rootScope.toParams = toParams;
          $state.go('app.login');
        }
      });
    }
  });
  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
    console.error('State change error: ', error, {
      event: event,
      toState: toState,
      toParams: toParams,
      fromState: fromState,
      fromParams: fromParams,
      error: error
    });
    if (error['get stack']) {
      console.error(error['get stack']());
    }
    event.preventDefault();
  });
});
