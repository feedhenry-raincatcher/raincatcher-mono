'use strict';

var express = require('express')
  , app = express()
  , bodyParser = require('body-parser')
  , cors = require('cors')
  , moment = require('moment');

app.use(cors());
//Using a body parser for JSON requests.
app.use(bodyParser.json());

var router = require('raincatcher-tutorial-module').setUpEventRouter();
//Mounting the tutorial module on the base route for the ExpressJS application
app.use('/', router);

router.events.on('list', function() {
  console.log({
    topic: 'list',
    time: moment(new Date()).toString()
  });
});

router.events.on('create', function(createdUser) {
  console.log({
    topic: 'create',
    time: moment(new Date()).toString(),
    user: createdUser
  });
});

module.exports = app;
