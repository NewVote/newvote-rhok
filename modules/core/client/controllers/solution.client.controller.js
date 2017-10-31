'use strict';

angular.module('core').controller('SolutionController', ['$scope', 'Authentication', '$mdSidenav', '$rootScope', '$mdMenu', '$state', '$stateParams', 'SolutionService', 'IssueService', 'ActionService', '$q', '$mdDialog', 'VoteService', 'VOTE_TYPES', 'solution', 'actions', 'media', 'UploadService', 'SortService', 'isSingleAction', 'SocialshareService', '$mdConstant',
	function ($scope, Authentication, $mdSidenav, $rootScope, $mdMenu, $state, $stateParams, SolutionService, IssueService, ActionService, $q, $mdDialog, VoteService, VOTE_TYPES, solution, actions, media, UploadService, SortService, isSingleAction, SocialshareService, $mdConstant) {
		// This provides Authentication context.
		var vm = this;
		vm.solution = solution;
		vm.newAction = {};
		vm.actions = Array.isArray(actions) ? actions : [actions];
		vm.sortSvc = SortService;
		vm.isSingleAction = isSingleAction;
		vm.media = media;

		vm.chartLabels = ['Against', 'For'];
		vm.chartOptions = {
			elements: {
				arc: {
					borderWidth: 0
				}
			},
			responsive: true,
			legend: {
				display: false
			}
		};

		vm.chartColors = [{
				backgroundColor: 'rgba(255,0,0,0.8)',
				pointBackgroundColor: 'rgba(255,0,0,0.5)',
				pointHoverBackgroundColor: 'rgba(255,0,0,0.6)',
				borderColor: 'rgba(255,0,0,0.6)',
				pointBorderColor: 'rgba(255,0,0,0.6)',
				pointHoverBorderColor: 'rgba(255,0,0,0.6)'
			},
			{
				backgroundColor: 'rgba(0,255,0,0.8)',
				pointBackgroundColor: 'rgba(0,255,0,0.5)',
				pointHoverBackgroundColor: 'rgba(77,83,96,1)',
				borderColor: 'rgba(77,83,96,1)',
				pointBorderColor: '#fff',
				pointHoverBorderColor: 'rgba(77,83,96,0.8)'
			}
		];

		// Meta tags
		vm.desc = $rootScope.removeHtmlElements(vm.solution.description);
		vm.image = vm.solution.imageUrl;
		if ($state.is('solutions.action')) {
			vm.desc = 'Proposed action for the solution "' + vm.solution.title + '": ' + vm.actions[0].title;
		}

		vm.customKeys = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA, $mdConstant.KEY_CODE.SPACE];

		$scope.authentication = Authentication;
		$scope.prerender = document.getElementById('prerender');

		if ($stateParams.issueId) {
			IssueService.get($stateParams.issueId).then(function (issue) {
				vm.solution.issues.push(issue);
			});
		}

		// Title
		vm.titleText = '';
		if (vm.solution._id && $state.is('solutions.edit')) {
			vm.titleText = 'Edit Solution - ' + vm.solution.title;
			$rootScope.headerTitle = vm.solution.title + ' (editing)';
		} else if ($state.is('solutions.create')) {
			vm.titleText = 'Add a Solution';
			$rootScope.headerTitle = 'Add Solution';
		} else if ($state.is('solutions.view')) {
			vm.titleText = solution.title;
			$rootScope.headerTitle = "Solution";
		} else if ($state.is('solutions.action')) {
			vm.titleText = solution.title + ' | Proposed Action';
			$rootScope.headerTitle = 'Proposed Action';
		}
		vm.title = $rootScope.titlePrefix + vm.titleText + $rootScope.titleSuffix;

		function getActions() {
			ActionService.list({
				solutionId: $stateParams.solutionId
			}).then(function (actions) {
				vm.actions = actions;
			}, function (err) {
				console.log('Error getting actions for solution', $stateParams.solutionId, err);
			});
		}

		vm.share = function (provider) {
			SocialshareService.share({
				provider: provider,
				rel_url: '/solutions/' + vm.solution._id,
				title: vm.solution.title,
				hashtags: vm.solution.tags.join()
			});
		};

		vm.shareAction = function (action, provider) {
			SocialshareService.share({
				provider: provider,
				rel_url: '/solutions/' + vm.solution._id + '/?actionId=' + action._id,
				title: action.title,
				hashtags: vm.solution.tags.join()
			});
		};

		vm.createOrUpdate = function () {
			var promise = $q.resolve();
			if (vm.imageFile) {
				promise = UploadService.upload(vm.imageFile).then(function () {
					console.log('uploaded file', vm.imageFile);
					vm.solution.imageUrl = vm.imageFile.result.url;
				});
			}
			return promise.then(function () {
				return SolutionService.createOrUpdate(vm.solution).then(function (solution) {
					$state.go('solutions.view', {
						solutionId: solution._id
					});
				});
			});
		};

		vm.delete = function () {
			if (!vm.solution._id) return;

			confirm('Are you sure you want to delete this solution?',
				'This cannot be undone. Please confirm your decision').then(function () {
				SolutionService.delete(vm.solution._id).then(function () {
					$state.go('solutions.list');
				});
			});
		};

		vm.showCreateAction = function () {
			vm.creatingAction = !vm.creatingAction;
		};

		vm.createAction = function () {
			vm.newAction.solution = $stateParams.solutionId;
			ActionService.createOrUpdate(vm.newAction).then(function () {
				getActions();
				vm.creatingAction = false;
				vm.newAction = {};
			});
		};

		vm.searchIssues = function (query) {
			return IssueService.searchIssues({
				search: query
			});
		};

		vm.deleteAction = function (action) {
			confirm('Are you sure you want to delete this action?', 'This cannot be undone.').then(function () {
				ActionService.delete(action._id).then(function () {
					getActions();
				});
			});
		};

		vm.voteAction = function (action, voteType, $event) {
			$event.stopPropagation();
			VoteService.vote(action, 'Action', voteType).then(function (data) {
				action.$get();
			});
		};

		vm.vote = function (voteType) {
			VoteService.vote(vm.solution, 'Solution', voteType).then(function (data) {
				vm.solution.$get();
			});
		};

		vm.sort = function (sortData, $event) {
			if ($event) $event.stopPropagation();
			console.log('sorting by: ', sortData.type, sortData.order);
			SortService.setSort('action', sortData.type, sortData.order);
		};

		function confirm(title, text) {
			var confirmDialog = $mdDialog.confirm()
				.title(title)
				.textContent(text)
				.ok('Yes')
				.cancel('No');

			return $mdDialog.show(confirmDialog);
		}

		angular.element(document).find('script[src="https://pol.is/embed.js"]').remove();
		var el = angular.element('<script>').attr('src', 'https://pol.is/embed.js');
		angular.element(document).find('body').append(el);
	}
]);
