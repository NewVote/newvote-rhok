'use strict';

angular.module('core').controller('SuggestionsController', ['$scope', '$rootScope', '$state', '$stateParams', 'Authentication', '$q', 'SuggestionsService',
	function ($scope, $rootScope, $state, $stateParams, Authentication, $q, SuggestionsService) {
		var vm = this;
		vm.suggestion = {};
		
		// Title
		vm.title = $rootScope.titlePrefix + 'Create a Suggestion' + $rootScope.titleSuffix;		
		vm.desc = 'Create and submit a suggestion';
		$rootScope.headerTitle = 'Create a Suggestion';

		vm.create = function () {
			var promise = $q.resolve();

			return promise.then(function () {
				return SuggestionsService.createOrUpdate(vm.suggestion).then(function (suggestion) {
					$state.go('thanks', {});
				});
			});
		};

	}
]);
