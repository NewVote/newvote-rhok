'use strict';
angular.module(ApplicationConfiguration.applicationModuleName)
.constant('_', window._)
.constant('VOTE_TYPES', {
  up: 1,
  down: -1,
  cancel: 0
});
