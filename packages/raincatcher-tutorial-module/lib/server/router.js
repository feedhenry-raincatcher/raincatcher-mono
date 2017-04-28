var express = require('express');
var userStore = require('nano-store');
var config = require('../config-user');
var EventEmitter = require('events');

/**
 * Setting up an ExpressJS router to handle requests from the client side of this module.
 */
module.exports = function setUpEventRouter() {
  var userRouter = express.Router();
  userRouter.events = new EventEmitter();
  var userRoute = userRouter.route(config.apiPath);

  userRoute.get(function(req, res) {
    userStore.list()
      .tap(function(list) {
        userRouter.events.emit('list', list);
      })
      .then(res.json.bind(res));
  });
  userRoute.post(function(req, res) {
    var userToCreate = req.body;
    userStore.add(userToCreate)
      .tap(function(newUser) {
        userRouter.events.emit('list', newUser);
      })
      .then(res.json.bind(res));
  });

  return userRouter;
};