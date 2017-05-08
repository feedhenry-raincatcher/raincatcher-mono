var angular = require('angular');
var moment = require('moment');
angular.module('example-raincatcher-app').controller('TopicMonitorController', ['$scope', 'mediator', 'UserClientService', TopicMonitorController]);


/**
 *
 * This controller monitors all user topics and appends them to the UI.
 *
 *
 * The goal here is to highlight that you can subscribe to any topic outside the modules.
 * This allows apps that consume Raincatcher modules to have custom business logic that is fired by published topics
 * from modules.
 *
 * @param $scope
 * @param mediator
 * @constructor
 */
function TopicMonitorController($scope, mediator) {
  $scope.topics = [];

  $scope.clearTopicList = function() {
    $scope.topics = [];
  };

  mediator.subscribe('wfm:user:list', function() {
    $scope.topics.push({
      topic: 'wfm:user:list',
      time: moment(new Date())
    });
  });

  mediator.subscribe('done:wfm:user:list', function() {
    $scope.topics.push({
      topic: 'done:wfm:user:list',
      time: moment(new Date())
    });
  });

  mediator.subscribe('wfm:user:create', function(userToCreate) {
    $scope.topics.push({
      topic: 'wfm:user:create',
      time: moment(new Date()),
      user: JSON.stringify(userToCreate)
    });
  });

  mediator.subscribe('done:wfm:user:create', function(createdUser) {
    $scope.topics.push({
      topic: 'done:wfm:user:create',
      time: moment(new Date()),
      user: JSON.stringify(createdUser)
    });
  });

}

