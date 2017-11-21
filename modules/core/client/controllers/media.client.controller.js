'use strict';

angular.module('core').controller('MediaController', ['$scope', '$rootScope', '$state', '$stateParams', 'Authentication', '$q', 'media', 'IssueService', 'GoalService', 'MediaService',
	function ($scope, $rootScope, $state, $stateParams, Authentication, $q, media, IssueService, GoalService, MediaService) {
		var vm = this;
		vm.media = media;

		// Title
		vm.title = 'NewVote | Create Media';
		vm.desc = 'Create and submit Media';
		var previousState = '';
		var stateData = null;
		$rootScope.pageTitle = 'Create Media';
		vm.previewData = {};

		if ($stateParams.objectId && $stateParams.objectType) {
			if ($stateParams.objectType === 'issue') {
				IssueService.get($stateParams.objectId).then(function (issue) {
					previousState = 'issues.view';
					vm.media.issues.push(issue);
					stateData = {
						issueId: issue._id
					};
				});
			} else if ($stateParams.objectType === 'goal') {
				GoalService.get($stateParams.objectId).then(function (goal) {
					previousState = 'goals.view';
					vm.media.goals.push(goal);
					stateData = {
						goalId: goal._id
					};
				});
			}
		}
		if ($state.is('media.edit')) {
			if ($stateParams.objectType === 'issue') {
				previousState = 'issues.view';
				stateData = {
					issueId: $stateParams.previousObjectId
				};
			} else if ($stateParams.objectType === 'goal') {
				previousState = 'goals.view';
				stateData = {
					goalId: $stateParams.previousObjectId
				};
			}
		}

		vm.getMeta = function () {
			console.log('scraping meta for url: ', vm.media.url);
			vm.previewData = MediaService.getMeta(vm.media.url);
		};
		if (vm.media.url) {
			vm.getMeta();
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

		vm.createOrUpdate = function () {
			var promise = $q.resolve();
			return promise.then(function () {
				return MediaService.createOrUpdate(vm.media).then(function (media) {
					$state.go(previousState, stateData);
				});
			});
		};

		vm.delete = function (media) {
			if (!media._id) return;

			MediaService.delete(media._id).then(function () {
				$state.go(previousState, stateData);
			});
		};

	}
]);
