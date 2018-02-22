'use strict';

angular.module('core').controller('GoalController', ['$scope', 'Authentication', '$mdSidenav', '$rootScope', '$mdMenu', '$state', '$stateParams', '$location', '$anchorScroll', 'GoalService', 'IssueService', 'SolutionService', 'RegionService', '$q', '$mdDialog', 'VoteService', 'VOTE_TYPES', 'goal', 'solutions', 'endorsement', 'media', 'UploadService', 'SortService', 'isSingleSolution', '$mdConstant',
	function ($scope, Authentication, $mdSidenav, $rootScope, $mdMenu, $state, $stateParams, $location, $anchorScroll, GoalService, IssueService, SolutionService, RegionService, $q, $mdDialog, VoteService, VOTE_TYPES, goal, solutions, endorsement, media, UploadService, SortService, isSingleSolution, $mdConstant) {
		// This provides Authentication context.
		var vm = this;
		vm.goal = goal;
		vm.newSolution = {};
		vm.solutions = Array.isArray(solutions) ? solutions : [solutions];
		vm.sortSvc = SortService;
		vm.isSingleSolution = isSingleSolution;
		vm.endorsement = endorsement;
		vm.media = media;
		vm.regions = [];
		$scope.$state = $state;
		$scope.toggle = function() {
			$scope.interactions = !$scope.interactions;
		};
		$scope.scrollTo = function(id) {
      $location.hash(id);
      $anchorScroll();
   	};

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
		vm.desc = $rootScope.removeHtmlElements(vm.goal.description);
		vm.image = vm.goal.imageUrl;
		if ($state.is('goals.solution')) {
			vm.desc = 'Proposed solution for the goal "' + vm.goal.title + '": ' + vm.solutions[0].title;
		}

		vm.customKeys = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA];

		$scope.authentication = Authentication;
		$scope.prerender = document.getElementById('prerender');

		if ($stateParams.issueId) {
			IssueService.get($stateParams.issueId).then(function (issue) {
				vm.goal.issues.push(issue);
			});
		}

		// Title
		vm.titleText = '';
		if (vm.goal._id && $state.is('goals.edit')) {
			vm.titleText = 'Edit Goal - ' + vm.goal.title;
			$rootScope.headerTitle = vm.goal.title + ' (editing)';
		} else if ($state.is('goals.create')) {
			vm.titleText = 'Add a Goal';
			$rootScope.headerTitle = 'Add Goal';
		} else if ($state.is('goals.view')) {
			vm.titleText = goal.title;
			$rootScope.headerTitle = 'Goal';
		} else if ($state.is('goals.solution')) {
			vm.titleText = goal.title + ' | Proposed Solution';
			$rootScope.headerTitle = 'Proposed Solution';
		}
		vm.title = $rootScope.titlePrefix + vm.titleText + $rootScope.titleSuffix;

		vm.searchRegions = function (query) {
			return RegionService.searchRegions(query);
		};

		vm.updateVotes = function (regions) {
			// console.log(vm.goal);
			GoalService.get($stateParams.goalId, vm.regions).then(function (goal) {
				vm.goal = goal;
			});
			SolutionService.list({
				goalId: vm.goal._id,
				regions: regions
			}).then(function (solutions) {
				vm.solutions = solutions;
			});
		};

		function getSolutions() {
			SolutionService.list({
				goalId: $stateParams.goalId
			}).then(function (solutions) {
				vm.solutions = solutions;
			}, function (err) {
				console.log('Error getting solutions for goal', $stateParams.goalId, err);
			});
		}

		vm.createOrUpdate = function () {
			var promise = $q.resolve();
			if (vm.imageFile) {
				promise = UploadService.upload(vm.imageFile).then(function () {
					console.log('uploaded file', vm.imageFile);
					vm.goal.imageUrl = vm.imageFile.result.url;
				});
			}
			return promise.then(function () {
				return GoalService.createOrUpdate(vm.goal).then(function (goal) {
					$state.go('goals.view', {
						goalId: goal._id
					});
				});
			});
		};

		vm.delete = function () {
			if (!vm.goal._id) return;

			confirm('Are you sure you want to delete this goal?',
				'This cannot be undone. Please confirm your decision').then(function () {
				GoalService.delete(vm.goal._id).then(function () {
					$state.go('goals.list');
				});
			});
		};

		vm.showCreateSolution = function () {
			vm.creatingSolution = !vm.creatingSolution;
		};

		vm.createSolution = function () {
			vm.newSolution.goal = $stateParams.goalId;
			SolutionService.createOrUpdate(vm.newSolution).then(function () {
				getSolutions();
				vm.creatingSolution = false;
				vm.newSolution = {};
			});
		};

		vm.searchIssues = function (query) {
			return IssueService.list({
				search: query
			});
		};

		vm.deleteSolution = function (solution) {
			confirm('Are you sure you want to delete this solution?', 'This cannot be undone.').then(function () {
				SolutionService.delete(solution._id).then(function () {
					getSolutions();
				});
			});
		};

		vm.voteSolution = function (solution, voteType, $event) {
			$event.stopPropagation();
			VoteService.vote(solution, 'Solution', voteType).then(function (data) {
				solution.$get();
			});
		};

		vm.vote = function (voteType) {
			VoteService.vote(vm.goal, 'Goal', voteType).then(function (data) {
				vm.goal.$get();
			});
		};

		vm.sort = function (sortData, $event) {
			if ($event) $event.stopPropagation();
			// console.log('sorting by: ', sortData.type, sortData.order);
			SortService.setSort('solution', sortData.type, sortData.order);
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
