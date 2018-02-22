'use strict';

angular.module('core')
	.controller('HomeController', ['$scope', 'Authentication', '$mdSidenav', '$rootScope', '$mdMenu', '$state', 'SearchService', '$mdMedia', 'IssueService', 'GoalService', 'SolutionService', '$timeout', 'Carousel',
		function ($scope, Authentication, $mdSidenav, $rootScope, $mdMenu, $state, SearchService, $mdMedia, IssueService, GoalService, SolutionService, $timeout, Carousel) {
			// This provides Authentication context.
			$scope.authentication = Authentication;
			$scope.$state = $state;
			$scope.$mdMedia = $mdMedia;

			//number of slides to show on the carousel
			$scope.slidesToShow = 3;
			$scope.showCarousel = true;

			//watch for changes in screen width and catch when screen is gt-md
			$scope.$watch(function () {
				return $scope.$mdMedia('gt-md');
			}, function (gtMd) {
				if (gtMd) {
					//screen is greater than medium (gt-md)
					$scope.slidesToShow = 3;
					Carousel.setOptions({
						slidesToShow: $scope.slidesToShow
					});
					$scope.showCarousel = false;
					$timeout(function () {
						$scope.showCarousel = true;
					});
				} else {
					//screen is less than medium (xs, sm)
					$scope.slidesToShow = 1;
					Carousel.setOptions({
						slidesToShow: $scope.slidesToShow
					});
					$scope.showCarousel = false;
					$timeout(function () {
						$scope.showCarousel = true;
					});
				}
			});

			$rootScope.removeHtmlElements = function (text) {
				if (text != null) {
					//ignore this lint warning we need to test for undefined as well
					return text.replace(/<.*?> ?/g, '');
				} else {
					return '';
				}
			};

			$scope.message = true;

			// Page title config
			$rootScope.titlePrefix = '';
			$rootScope.titleSuffix = ' | NewVote';

			// Update title and description
			$scope.title = $rootScope.titlePrefix + 'Home' + $rootScope.titleSuffix;
			$scope.desc = 'NewVote is a dedicated online platform aimed at providing' +
				' balanced, unbiased information on the current federal political issues' +
				' and solutions in Australia. This information is maintained by an in de' +
				'pendent panel and is presented in a simplified and organised manner. It' +
				' also allows people to vote on the solutions, making people\'s opinion ' +
				'available to the decision makers.';
			$rootScope.headerTitle = 'Home';

			$scope.toggleMessage = function () {
				$scope.message = !$scope.message;
			};

			$scope.toggleLeft = function () {
				$mdSidenav('left')
					.toggle();
			};

			$scope.openMenu = function ($mdMenu, ev) {
				$mdMenu.open(ev);
			};

			$scope.results = [];

			$scope.getHyperLink = function (item) {
				return SearchService.getHyperLink(item);
			};

			$scope.searchAll = function (text) {
				$scope.results = SearchService.searchAll(text);
			};

			$scope.getItemTitle = function (item) {
				return SearchService.getItemTitle(item);
			};

			$scope.searchOpen = false;

			$scope.openSearch = function () {
				$scope.searchOpen = !$scope.searchOpen;
			};

			var vm = this;
			vm.issues = [];
			vm.goals = [];
			vm.solutions = [];

			getIssues();

			function getIssues() {
				return IssueService.list()
					.then(function (issues) {
						vm.issues = issues;
						return vm.issues;
					});
			}

			getGoals();

			function getGoals() {
				return GoalService.list()
					.then(function (goals) {
						vm.goals = goals;
						return vm.goals;
					});
			}

			getSolutions();

			function getSolutions() {
				return SolutionService.list()
					.then(function (solutions) {

						vm.solutions = solutions;
						return vm.solutions;
					});
			}

		}
	]);
