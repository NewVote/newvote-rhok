'use strict';

angular.module('core').controller('IssueController', ['$scope', 'Authentication', '$mdSidenav', '$rootScope', '$mdMenu', '$state', '$stateParams', '$location', '$anchorScroll', 'IssueService', '$mdDialog', 'issue', 'VoteService', 'goals', 'solutions', 'endorsement', 'media', 'UploadService', '$q', 'SortService', '$mdConstant',
	function ($scope, Authentication, $mdSidenav, $rootScope, $mdMenu, $state, $stateParams, $location, $anchorScroll, IssueService, $mdDialog, issue, VoteService, goals, solutions, endorsement, media, UploadService, $q, SortService, $mdConstant) {
		// This provides Authentication context.
		var vm = this;
		vm.issue = issue;
		vm.media = media;
		vm.issueId = issue._id;
		vm.goals = goals;
		vm.solutions = solutions;
		vm.endorsement = endorsement;
		$scope.$state = $state;
		$scope.toggle = function() {
			$scope.interactions = !$scope.interactions;
		};
		$scope.scrollTo = function(id) {
      $location.hash(id);
      $anchorScroll();
   	};

		console.log(endorsement);

		// Meta tags
		vm.desc = $rootScope.removeHtmlElements(vm.issue.description);
		vm.image = vm.issue.imageUrl;

		// Title
		vm.titleText = '';
		if (vm.issue._id && $state.is('issues.edit')) {
			vm.titleText = 'Edit Issue - ' + vm.issue.name;
			$rootScope.headerTitle = vm.issue.name + ' (editing)';
		} else if ($state.is('issues.create')) {
			vm.titleText = 'Add an Issue';
			$rootScope.headerTitle = 'Add Issue';
		} else if ($state.is('issues.view')) {
			vm.titleText = vm.issue.name;
			$rootScope.headerTitle = 'Issue';
		}

		vm.title = $rootScope.titlePrefix + vm.titleText + $rootScope.titleSuffix;

		$scope.authentication = Authentication;
		$scope.prerender = document.getElementById('prerender');

		vm.customKeys = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA];

		vm.createOrUpdate = function () {
			var promise = $q.resolve();
			if (vm.imageFile) {
				promise = UploadService.upload(vm.imageFile).then(function () {
					// console.log('uploaded file', vm.imageFile);
					vm.issue.imageUrl = vm.imageFile.result.url;
				});
			}
			return promise.then(function () {
				return IssueService.createOrUpdate(vm.issue).then(function (issue) {
					$state.go('issues.view', {
						issueId: issue._id
					});
				});
			});
		};

		vm.delete = function () {
			if (!vm.issue._id) return;
			var confirm = $mdDialog.confirm()
				.title('Are you sure you want to delete this issue?')
				.textContent('This cannot be undone. Please confirm your decision')
				.ok('Yes, I\'m sure')
				.cancel('No');

			$mdDialog.show(confirm).then(function () {
				IssueService.delete(vm.issue._id).then(function () {
					$state.go('issues.list');
				});
			});
		};

		vm.vote = function (goal, voteType, $event) {
			$event.stopPropagation();
			VoteService.vote(goal, 'Goal', voteType);
		};

		angular.element(document).find('script[src="https://pol.is/embed.js"]').remove();
		var el = angular.element('<script>').attr('src', 'https://pol.is/embed.js');
		angular.element(document).find('body').append(el);
	}
]);
