'use strict';

var queue = require('./queue');
var _ = require("lodash");
var QUEUE_NAME = "wfm-file-uploads";

var FileQueueManager = function($fh, fileClient) {
  this.$fh = $fh;
  this.uploadQueue = new queue(QUEUE_NAME);
  this.fileClient = fileClient;
  // Start processing uploads on startup
  this.startProcessingUploads();
  // Listen when client becomes online for uploads
  var self = this;
  document.addEventListener("online", function() {
    self.startProcessingUploads();
  });
};

FileQueueManager.prototype.removeFromQueue = function(object) {
  return this.uploadQueue.removeItem(object);
};

FileQueueManager.prototype.addQueueItem = function(object) {
  return this.uploadQueue.addItem(object);
};

FileQueueManager.prototype.startProcessingUploads = function() {
  var queueItems = this.uploadQueue.restoreData().getItemList();
  var promise;
  var self = this;
  if (queueItems && queueItems.length > 0) {
    console.log("Processing offline file queue. Number of items to save: ", queueItems.length);
    promise = this.saveFile(queueItems[0]).then(function() {
      _.each(queueItems, function(item) {
        promise = promise.then(function() {
          return self.saveFile(item);
        });
      });
    });
  } else {
    console.log("Offline file queue is empty");
  }
};

FileQueueManager.prototype.saveFile = function(queueItem) {
  var self = this;
  return self.fileClient.createFile(queueItem).then(function(createdFile) {
    self.removeFromQueue(queueItem);
    console.log("File saved", createdFile);
  });
};

module.exports = FileQueueManager;