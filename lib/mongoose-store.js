'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var buildQuery = require('./query-builder');

/**
 *
 * Converting the mongoose document to a JSON object.
 *
 * @param mongooseDocument
 * @returns {JSON}
 */
function convertToJSON(mongooseDocument) {
  return mongooseDocument ? mongooseDocument.toJSON() : undefined;
}


/**
 *
 * Creating an error describing a document that hasn't been found.
 *
 * @param {string} id - The ID of the document that wasn't found
 */
function createNoDocumentError(id) {
  var error = new Error("No document with id " + id  + " found");
  error.id = id;
  return Promise.reject(error);
}

/**
 *
 * A single mongoose store for a single data set (e.g. workorders etc)
 *
 * @param {string} _datasetId - The ID of the data set for this store
 * @param {Model} _model - The mongoose model associated with this data set.
 * @constructor
 */
function Store(_datasetId, _model) {
  this.model = _model;
  this.datasetId = _datasetId;
}

Store.prototype.init = function(data) {
  var self = this;
  if (!_.isArray(data)) {
    console.log("Initialization data is not array.");
    return Promise.resolve();
  }

  return Promise.map(data, function(entry) {
    var record = new self.model(entry);
    return record.save().catch(function(err) {
      return self.handleError(undefined, err);
    });
  });
};

Store.prototype.isPersistent = true;

/**
 *
 * Handling an error response that includes an ID.
 *
 * If it's a mongoose Validation Error, it should include the mongoose validation error message.
 *
 * @param {string} id - An ID to pass include with the error
 * @param {Promise} error - The error to handle
 */
Store.prototype.handleError = function handleError(id, error) {
  if (error.name === "ValidationError") {
    error = new Error(error.toString());
  }

  if (!(error instanceof Error)) {
    error = new Error(error);
  }

  error.message += " (" + this.datasetId + ")";

  error.id = id;

  return Promise.reject(error);
};

Store.prototype.create = function(object) {
  var self = this;
  var record = new this.model(object);
  return record.save().catch(function(err) {
    return self.handleError(undefined, err);
  });
};

Store.prototype.findById = function(id) {
  var self = this;
  return this.model.findOne({id: id}).exec().then(convertToJSON).catch(function(err) {
    return self.handleError(id, err);
  });
};

Store.prototype.read = function(_id) {
  var self = this;
  return this.model.findOne({id: _id}).exec().then(function(foundDocument) {

    if (!foundDocument) {
      return createNoDocumentError(_id);
    }

    return foundDocument;
  }).then(convertToJSON).catch(function(err) {
    return self.handleError(_id, err);
  });
};

Store.prototype.update = function(object) {
  var self = this;

  return this.model.findOne({id: object.id}).exec().then(function(foundDocument) {
    if (!foundDocument) {
      return createNoDocumentError(object.id);
    } else {
      _.extend(foundDocument, object);
      return foundDocument.save();
    }
  }).then(convertToJSON).catch(function(err) {
    return self.handleError(object.id, err);
  });
};

/**
 *
 * @param object
 * @returns {Promise}
 */
Store.prototype.remove = function(object) {
  var self = this;

  var id = object instanceof Object ? object.id : object;
  return this.model.findOneAndRemove({id: id}).then(convertToJSON).catch(function(err) {
    return self.handleError(id, err);
  });
};

/**
 *
 * Listing documents for a model.
 *
 * @param {object} filter - Optional filter to pass when listing documents for a model. (See https://docs.mongodb.com/manual/tutorial/query-documents/)
 */
Store.prototype.list = function(filter) {
  var self = this;
  filter = filter || {};

  var query = buildQuery(filter);

  var mongooseQuery = this.model.find(query);

  if (filter.sort && typeof filter.sort === 'object') {
    mongooseQuery.sort(filter.sort);
  }

  return mongooseQuery.exec().then(function(arrayOfDocuments) {
    return _.map(arrayOfDocuments || [], convertToJSON);
  }).catch(function(err) {
    return self.handleError(undefined, err);
  });
};

Store.prototype.buildQuery = buildQuery;

require('./listen')(Store);

module.exports = Store;