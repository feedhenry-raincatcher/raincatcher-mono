'use strict';

var app   = require('./lib/app.js')
  , http = require('http');

var server = http.createServer(app);
server.listen(8001, "localhost", function() {
  console.log("App started at: " + new Date() + " on port: " + 8001);
});
