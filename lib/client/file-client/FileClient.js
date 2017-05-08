'use strict';

var config = require('../../config');
var q = require('q');
var FileQueueManager = require("../offline-manager");


/**
 * A FileClient service that will be responsible for file data management
 *
 * @param {object} config
 * @param {object} fhSdk
 * @constructor
 */
var FileClient = function FileClient(config, fhSdk) {
  this.$fh = fhSdk;
  this.init();
};

FileClient.prototype.init = function() {
  var self = this;
  var deferredFhinit = q.defer();
  this.$fh.on('fhinit', function(error) {
    if (error) {
      deferredFhinit.reject(new Error(error));
      return;
    }
    self.cloudUrl = self.$fh.getCloudURL();
    deferredFhinit.resolve();
  });

  var deferredReady = q.defer();
  if (window.cordova) {
    document.addEventListener("deviceready", function cameraReady() {
      deferredReady.resolve();
    }, false);
  } else {
    deferredReady.resolve();
  }
  
  this.initPromise = q.all([deferredFhinit.promise, deferredReady.promise]);
  this.initPromise.then(function() {
    self.fileQueueManager = new FileQueueManager(self.$fh, self);
  });
  
  return this.initPromise;
};


/***
 * List files for particular user. If user parameter is not provided returns list of all files
 *
 * @param userId
 */
FileClient.prototype.list = function(userId) {
  var url = !userId ? config.apiPath + '/all' : config.apiPath + '/owner/' + userId;
  var deferred = q.defer();
  this.$fh.cloud({ path: url, method: 'get' },
    function(res) {
      deferred.resolve(res);
    },
    function(message, props) {
      var e = new Error(message);
      e.props = props;
      deferred.reject(e);
    }
  );
  return deferred.promise;
};

/**
 * Upload file to server.
 * Function would choose right method depending on parameters.
 *
 * @param file {userId, fileURI, options, dataUrl}
 * @returns {*}
 */
FileClient.prototype.createFile = function(file) {
  if (file.fileURI && file.options) {
    return this.uploadFile(file.userId, file.fileURI, file.options);
  } else if (file.dataUrl) {
    return this.uploadDataUrl(file.userId, file.dataUrl);
  } else {
    return q.reject('Missing required fields for file object ', file);
  }
};


/**
 * Add file to upload queue. File would be uploaded depending on internet connectivity.
 *
 * @param file {userId, fileURI, options, dataUrl}
 * @returns {*}
 */
FileClient.prototype.scheduleFileToBeUploaded = function(file) {
  var self = this;
  return this.createFile(file).then(function(result) {
    return q.resolve(result);
  }).catch(function(err) {
    // Add item to queue
    self.fileQueueManager.addQueueItem(file);
    return q.reject(err);
  });
};


/**
 * Upload file using local file URI. Used for uploads on mobile devices (cordova based)
 *
 * @param userId
 * @param fileURI
 * @param options
 * @returns {*}
 */
FileClient.prototype.uploadFile = function(userId, fileURI, options) {
  var self = this;
  if (arguments.length < 2) {
    return q.reject('userId and fileURI parameters are required.');
  } else {
    options = options || {};
    var fileUploadOptions = new FileUploadOptions();
    fileUploadOptions.fileKey = options.fileKey || 'binaryfile';
    fileUploadOptions.fileName = options.fileName;
    fileUploadOptions.mimeType = options.mimeType || 'image/jpeg';
    fileUploadOptions.params = {
      ownerId: userId,
      fileName: options.fileName
    };
    var timeout = options.timeout || 2000;
    var retries = options.retries || 1;
    return this.initPromise.then(function() {
      var serverURI = window.encodeURI(self.cloudUrl + config.apiPath + '/upload/binary');
      return fileUploadRetry(fileURI, serverURI, fileUploadOptions, timeout, retries);
    });
  }
};

/**
 * Upload file using dataUrl.
 * Used by local desktop camera when app running on non mobile environments
 *
 * @param userId
 * @param dataUrl
 */
FileClient.prototype.uploadDataUrl = function(userId, dataUrl) {
  var deferred = q.defer();
  if (arguments.length < 2) {
    deferred.reject('Both userId and a dataUrl parameters are required.');
  } else {
    this.$fh.cloud({
      path: config.apiPath + '/owner/'+userId+'/upload/base64/photo.png',
      method: 'post',
      data: dataUrl
    },
    function(res) {
      deferred.resolve(res);
    },
    function(message, props) {
      var e = new Error(message);
      e.props = props;
      deferred.reject(e);
    });
  }
  return deferred.promise;
};

// Handling file upload to server
function fileUpload(fileURI, serverURI, fileUploadOptions) {
  var deferred = q.defer();
  var transfer = new FileTransfer();
  transfer.upload(fileURI, serverURI, function uploadSuccess(response) {
    deferred.resolve(response);
  }, function uploadFailure(error) {
    deferred.reject(error);
  }, fileUploadOptions);
  return deferred.promise;
}

// Handling retry mechanism of the file upload.
function fileUploadRetry(fileURI, serverURI, fileUploadOptions, timeout, retries) {
  return fileUpload(fileURI, serverURI, fileUploadOptions)
  .then(function(response) {
    return response;
  }, function() {
    if (retries === 0) {
      throw new Error("Can't upload to " + JSON.stringify(serverURI));
    }
    return q.delay(timeout)
    .then(function() {
      return fileUploadRetry(fileURI, serverURI, fileUploadOptions, timeout, retries - 1);
    });
  });
}

module.exports = FileClient;
