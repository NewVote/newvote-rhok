'use strict';
angular.module(ApplicationConfiguration.applicationModuleName)
	.constant('_', window._)
	.constant('VOTE_TYPES', {
		str_disagree: -1,
		disagree: -0.5,
		cancel: 0,
		agree: 0.5,
		str_agree: 1,
	});
