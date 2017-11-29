'use strict';

angular.module('core').controller('SuggestionsController', ['$scope', '$rootScope', '$state', '$stateParams', '$location', 'Authentication', '$q', 'SuggestionsService', 'IssueService', 'GoalService', 'SolutionService', 'suggestion',
	function ($scope, $rootScope, $state, $stateParams, $location, Authentication, $q, SuggestionsService, IssueService, GoalService, SolutionService, suggestion) {
		var vm = this;
		vm.suggestion = suggestion;
		vm.parentObject = {};
		vm.type = $stateParams.suggestionType;
		vm.objectType = $stateParams.objectType;
		vm.objectId = $stateParams.objectId;
		console.log($stateParams);

		// Title
		switch (vm.type) {
			case 'edit':
				vm.title = $rootScope.titlePrefix + 'Suugest an edit' + $rootScope.titleSuffix;
				vm.desc = 'Suggest an edit to the content of an article';
				$rootScope.headerTitle = 'Suggest an Edit';
				break;
			default:
				vm.title = $rootScope.titlePrefix + 'Create a Suggestion' + $rootScope.titleSuffix;
				vm.desc = 'Create and submit a suggestion';
				$rootScope.headerTitle = 'Create a Suggestion';
				break;
		}

		switch (vm.objectType) {
			case 'issue':
				IssueService.get(vm.objectId).then(function (issue) {
					console.log('got issue as parentObject: ', issue);
					vm.parentObject = issue;
					if(vm.type == 'edit'){
						vm.suggestion.title = 'Edit for issue: ' + issue.name;
					}else {
						vm.suggestion.title = 'New goal for issue: ' + issue.name;
					}
					vm.suggestion.issues.push(issue);
				});
				break;
			case 'goal':
				GoalService.get(vm.objectId).then(function (goal) {
					console.log('got goal as parentObject: ', goal);
					vm.parentObject = goal;
					if(vm.type == 'edit'){
						vm.suggestion.title = 'Edit for goal: ' + goal.title;
					}else {
						vm.suggestion.title = 'New solution for goal: ' + goal.title;
					}
					vm.suggestion.goals.push(goal);
				});
				break;
			case 'solution':
				SolutionService.get(vm.objectId).then(function (solution) {
					console.log('got solution as parentObject: ', solution);
					vm.parentObject = solution;
					vm.suggestion.title = 'Edit for solution: ' + solution.title;
				});
				break;
		}


		vm.searchIssues = function (query) {
			return IssueService.list({
				search: query
			});
		};

		vm.searchGoals = function (query) {
			return GoalService.list({
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
