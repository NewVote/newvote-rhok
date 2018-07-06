'use strict';

angular.module('core')
	.controller('MediaController', ['$scope', '$rootScope', '$state', '$stateParams', 'Authentication', '$q', 'media', 'IssueService', 'GoalService', 'SolutionService', 'MediaService',
		function ($scope, $rootScope, $state, $stateParams, Authentication, $q, media, IssueService, GoalService, SolutionService, MediaService) {
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
					IssueService.get($stateParams.objectId)
						.then(function (issue) {
							previousState = 'issues.view';
							vm.media.issues.push(issue);
							stateData = {
								issueId: issue._id
							};
						});
				} else if ($stateParams.objectType === 'goal') {
					GoalService.get($stateParams.objectId)
						.then(function (goal) {
							previousState = 'goals.view';
							vm.media.goals.push(goal);
							stateData = {
								goalId: goal._id
							};
						});
				} else if ($stateParams.objectType === 'solution') {
					SolutionService.get($stateParams.objectId)
						.then(function (solution) {
							previousState = 'solutions.view';
							vm.media.solutions.push(solution);
							stateData = {
								solutionId: solution._id
							};
						});
				}
			} else {
				//there was no previous object data so just set previous state to home page
				previousState = 'home';
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
				} else if ($stateParams.objectType === 'solution') {
					previousState = 'solutions.view';
					stateData = {
						solutionId: $stateParams.previousObjectId
					};
				}
			}

			// http://www.abc.net.au/news/2015-05-07/e-health-programs-should-be-used-to-tackle-mental-health-issues/6450972
			vm.getMeta = function () {
				console.log('scraping meta for url: ', vm.media.url);
				MediaService.getMeta(vm.media.url)
					.$promise.then(function (meta) {
						console.log('meta is: ', meta);
						vm.media.title = meta.title;
						vm.media.description = meta.description;
						vm.media.image = meta.image;
						vm.media.imageOnly = false;
						console.log('finished scrape');
					}, function (err) {
						console.log('was an error scraping');
						if (/\.(jpe?g|png|gif|bmp)$/i.test(vm.media.url)) {
							console.log('user linking directly to image');
							vm.media.image = vm.media.url;
							vm.media.imageOnly = true;
						}
					});
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

			vm.searchSolutions = function (query) {
				return SolutionService.list({
					search: query
				});
			};

			vm.createOrUpdate = function () {
				var promise = $q.resolve();
				return promise.then(function () {
					return MediaService.createOrUpdate(vm.media)
						.then(function (media) {
							$state.go(previousState, stateData);
						});
				});
			};

			vm.delete = function (media) {
				if (!media._id) return;

				MediaService.delete(media._id)
					.then(function () {
						$state.go(previousState, stateData);
					});
			};

		}
	]);
