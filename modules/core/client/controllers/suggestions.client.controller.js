'use strict';

angular.module('core').controller('SuggestionsController', ['$scope', '$rootScope', '$state', '$stateParams', '$location', 'Authentication', '$q', 'SuggestionsService', 'IssueService', 'SolutionService', 'suggestion',
	function ($scope, $rootScope, $state, $stateParams, $location, Authentication, $q, SuggestionsService, IssueService, SolutionService, suggestion) {
		var vm = this;
		vm.suggestion = suggestion;

		// Title
		vm.title = $rootScope.titlePrefix + 'Create a Suggestion' + $rootScope.titleSuffix;
		vm.desc = 'Create and submit a suggestion';
		$rootScope.headerTitle = 'Create a Suggestion';

		vm.searchIssues = function (query) {
			return IssueService.list({
				search: query
			});
		};

		vm.searchSolutions = function (query) {
			return SolutionService.list({
				search: query
			});
		};

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
