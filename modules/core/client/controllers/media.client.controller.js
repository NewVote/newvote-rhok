'use strict';

angular.module('core').controller('MediaController', ['$scope', '$rootScope', '$state', '$stateParams', 'Authentication', '$q', 'media', 'IssueService', 'SolutionService',
	function ($scope, $rootScope, $state, $stateParams, Authentication, $q, media, IssueService, SolutionService) {
		var vm = this;
		vm.media = media;

		// Title
		vm.title = 'NewVote | Create Media';
		vm.desc = 'Create and submit Media';
		$rootScope.pageTitle = "Create Media";

		if ($stateParams.objectId && $stateParams.objectType) {
			if($stateParams.objectType === "issue"){
				IssueService.get($stateParams.objectId).then(function (issue) {
					vm.media.issues.push(issue);
				});
			}else if($stateParams.objectType === "solution"){
				SolutionService.get($stateParams.objectId).then(function (issue) {
					vm.media.solutions.push(issue);
				});
			}

		}

		vm.searchIssues = function (query) {
			return IssueService.list(query);
		};

		vm.searchSolutions = function (query) {
			return SolutionService.list(query);
		};

		vm.createOrUpdate = function () {
			console.log("creating new media now");
			// var promise = $q.resolve();
			//
			// return promise.then(function () {
			// 	return SuggestionsService.createOrUpdate(vm.suggestion).then(function (suggestion) {
			// 		$state.go('thanks', {});
			// 	});
			// });
		};

	}
]);
