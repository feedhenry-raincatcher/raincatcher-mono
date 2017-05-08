var angular = require('angular');


angular.module('example-raincatcher-app').directive('topicList', function($templateCache) {

  return {
    restrict: 'E',
    template: $templateCache.get('wfm-template/topicMonitor.tpl.html'),
    controller: 'TopicMonitorController'
  };
});
