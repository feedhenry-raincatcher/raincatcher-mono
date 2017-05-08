var angular = require('angular');
angular.module('wfm.users').controller('UserController', ['$scope', 'mediator', 'UserClientService', UserController]);

/**
 * Controller for managing the User directive.
 *
 * This is responsible for emitting and subscribing to events related to users.
 *
 * @param $scope
 * @param mediator
 * @constructor
 */
function UserController($scope, mediator) {

  //Setting initial users list.
  $scope.users = [];

  //Initial state for adding a new user.
  //The fields will be bound in the directive.
  $scope.newUser = {};

  $scope.loading = true;

  //Subscribing to the `done` state for the `wfm:user:list` topic.
  //Whenever this topic is fired, the list of users in the view should be updated.
  mediator.subscribe('done:wfm:user:list', function(userList) {
    $scope.$apply(function() {
      $scope.loading = false;
      $scope.users = userList;
    });
  });

  //Whenever a new user has been created, get an updated list of users from the server.
  mediator.subscribe('done:wfm:user:create', function() {
    mediator.publish('wfm:user:list');
  });

  //Adding a new user: this is done by publishing the `wfm:user:create` topic with the user to be created
  $scope.addUser = function addUser() {
    $scope.loading = true;
    mediator.publish('wfm:user:create', $scope.newUser);
  };

  //Publishing the wfm:user:list topic to get a list of users from the cloud.
  //This is listened to by the `services/user-client`
  mediator.publish('wfm:user:list');
}

module.exports = 'UserController';