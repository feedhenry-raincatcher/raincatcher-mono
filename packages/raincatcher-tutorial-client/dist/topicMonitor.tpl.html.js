var ngModule;
try {
  ngModule = angular.module('example-raincatcher-app');
} catch (e) {
  ngModule = angular.module('example-raincatcher-app', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/topicMonitor.tpl.html',
    '<div class="topicList">\n' +
    '  <h2>Topic List</h2>\n' +
    '  <button ng-click="clearTopicList()">Clear Topic List</button>\n' +
    '\n' +
    '  <ul>\n' +
    '    <li ng-repeat="topic in topics">\n' +
    '      {{topic.time}} : {{topic.topic}} : {{topic.user}}\n' +
    '    </li>\n' +
    '  </ul>\n' +
    '</div>');
}]);
