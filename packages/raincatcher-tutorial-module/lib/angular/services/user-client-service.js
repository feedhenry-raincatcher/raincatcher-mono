var angular = require('angular');
var config = require('../../config-user');
var request = require('request');

//Creating an angular service that depends on the raincatcher-mediator module. This `mediator` module is shared by all client modules.
angular.module('wfm.users').service('UserClientService',  ['mediator', function(mediator) {
  return new UserClient(mediator);
}]);

//A client for making requests to the cloud side of the user module.
function UserClient(mediator) {
  var self = this;

  //Subscribing to the `wfm:user:list` topic. When this topic is fired, a http request will be made to the cloud side.
  mediator.subscribe('wfm:user:list', function() {
    self.list(function(error, userList) {

      //If there is an error in the http request, then publish the error state for the `wfm:user:list` topic.
      if (error) {
        mediator.publish('error:wfm:user:list', error);
      } else {
        //No error, publish the `done` state for the `wfm:user:list` topic with the list of users obtained.
        mediator.publish('done:wfm:user:list', userList);
      }
    });
  });

  mediator.subscribe('wfm:user:create', function(userToCreate) {
    self.create(userToCreate, function(error, createdUser) {
      //If there is an error in the http request, then publish the error state for the `wfm:user:create` topic.
      if (error) {
        mediator.publish('error:wfm:user:create', error);
      } else {
        //No error, publish the `done` state for the `wfm:user:create` topic with the list of users obtained.
        mediator.publish('done:wfm:user:create', createdUser);
      }
    });
  });
}

/**
 * Calling the list endpoint in the `server/router.js` file.
 *
 * This endpoint will be mounted on the cloud side of the module.
 *
 * @param callback - function to be called when the response has returned from the cloud.
 */
UserClient.prototype.list = function list(callback) {

  //This url is where the users cloud side router is mounted in a cloud app.
  var listUrl = config.apiHost + config.apiPath;

  //Making a get request that will get a list of users.
  request.get({
    url: listUrl,
    json: true
  }, function(error, httpResponse, body) {
    return callback(error, body);
  });
};


/**
 * Calling the create endpoint to create a new user.
 *
 * @param userToCreate - Object describing the user to create.
 * @param callback     - function to be called when the response has returned from the cloud.
 */
UserClient.prototype.create = function create(userToCreate, callback) {
  //This url is where the users cloud side router is mounted in a cloud app. See `server/router.js`
  var createUrl = config.apiHost + config.apiPath;

  //Making a POST request that will add the user and return the created user from the cloud.
  request.post({
    url: createUrl,
    body: userToCreate,
    json: true
  }, function(error, httpResponse, body) {
    return callback(error, body);
  });

};