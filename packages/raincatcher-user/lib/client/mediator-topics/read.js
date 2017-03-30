var CONSTANTS = require('../../constants');

/**
 * Initialsing a subscriber for Reading users.
 *
 * @param {object} userEntityTopics
 * @param {UserClient} userClient - The User Client
 */
module.exports = function listUsersSubscriber(userEntityTopics, userClient) {

  /**
   *
   * Handling the listing of users
   *
   * @param {object} parameters
   * @param {String} parameters.id               - The ID of the user to read
   * @param {string/number} parameters.topicUid  - (Optional)  A unique ID to be used to publish completion / error topics.
   * @returns {*}
   */
  return function handleReadUsersTopic(parameters) {
    var self = this;
    parameters = parameters || {};
    var userReadErrorTopic = userEntityTopics.getTopic(CONSTANTS.TOPICS.READ, CONSTANTS.ERROR_PREFIX, parameters.topicUid);
    var userReadDoneTopic = userEntityTopics.getTopic(CONSTANTS.TOPICS.READ, CONSTANTS.DONE_PREFIX, parameters.topicUid);

    userClient.read(parameters.id)
      .then(function(arrayOfUsers) {
        self.mediator.publish(userReadDoneTopic, arrayOfUsers);
      }).catch(function(error) {
        self.mediator.publish(userReadErrorTopic, error);
      });
  };
};