'use strict';

var express = require('express')
  , app = express()
  , mediator = require('fh-wfm-mediator/lib/mediator')
  , bodyParser = require('body-parser')
  , cors = require('cors')
  , moment = require('moment');


app.use(cors());

//Using a body parser for JSON requests.
app.use(bodyParser.json());

//Mounting the tutorial module on the base route for the ExpressJS application
app.use('/', require('wfm-tutorial-module/lib/server/router')(mediator));

//Listening for user events on the mediator. This is to monitor the events and log any user events fired.

mediator.subscribe('wfm:user:list', function() {
  console.log({
    topic: 'wfm:user:list',
    time: moment(new Date()).toString()
  });
});

mediator.subscribe('done:wfm:user:list', function() {
  console.log({
    topic: 'done:wfm:user:list',
    time: moment(new Date()).toString()
  });
});

mediator.subscribe('wfm:user:create', function(userToCreate) {
  console.log({
    topic: 'wfm:user:create',
    time: moment(new Date()).toString(),
    user: userToCreate
  });
});

mediator.subscribe('done:wfm:user:create', function(createdUser) {
  console.log({
    topic: 'done:wfm:user:create',
    time: moment(new Date()).toString(),
    user: createdUser
  });
});

module.exports = exports = app;
