var express = require('express');
var userStore = require('./userStore');
var config = require('../config-user');

/**
 * Setting up an ExpressJS router to handle requests from the client side of this module.
 * @param mediator
 */
module.exports = function setUpEventRouter(mediator) {

  //Setting up the user store on the same mediator
  //This registers the events needed to deal with the user store.
  userStore(mediator);

  //Creating a new standard ExpressJS router to deal with http requests.
  //This router can be mounted on any ExpressJS route.
  var userRouter = express.Router();

  //Mounting the user routes on the same API Path as used by the client side `angular/services/user-client`
  var userRoute = userRouter.route(config.apiPath);

  //This route handles https request from the client side to list all users.
  //This is called from the `angular/services/user-client.js` on the client side.
  userRoute.get(function(req, res) {

    //Subscribing to the completion state for the `wfm:example:list` operation.
    //This is processed in the `userStore.js` file.
    mediator.once('done:wfm:user:list', function(userList) {
      //Having got the list, the response is sent to the client.
      res.json(userList);
    });

    //Publishing the `wfm:example:list` event to get a list of the users.
    //This event is subscribed to by the `userStore.js` file.
    mediator.publish('wfm:user:list');
  });

  //Handler to process a request to create a new user.
  //This endpoint is called from the `angular/services/user-client.js`
  userRoute.post(function(req, res) {

    var userToCreate = req.body;

    //Subscribing once to the `done` state for the `wfm:user:create` topic
    //This will return the created user to the client side of the module.
    mediator.once('done:wfm:user:create', function(createdUser) {
      res.json(createdUser);
    });

    //Subscribing once to the `error` state for the `wfm:user:create` topic.
    //This will return a 500 status to the client side.
    mediator.once('error:wfm:user:create', function(error) {
      res.status(500).end(error);
    });

    //Publishing the `wfm:user:create` topic to have the user created.
    mediator.publish('wfm:user:create', userToCreate);
  });

  return userRouter;
};