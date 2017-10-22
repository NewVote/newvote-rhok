'use strict';

angular.module('core').controller('SuggestionsController', ['$scope', '$state', '$stateParams', 'Authentication', '$q', 'SuggestionsService',
	function ($scope, $state, $stateParams, Authentication, $q, SuggestionsService) {
		var vm = this;
		vm.suggestion = {};
		
		// Title
		vm.title = 'NewVote | Create a Suggestion';		
		vm.desc = 'Create and submit a suggestion';

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
