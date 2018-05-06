'use strict';

angular.module('core')
	.controller('AboutController', ['$scope', 'Authentication', '$mdSidenav', '$rootScope', '$mdMenu', '$state', 'SearchService', '$mdMedia', 'IssueService', 'GoalService', 'SolutionService', '$timeout', 'Carousel',
		function ($scope, Authentication, $mdSidenav, $rootScope, $mdMenu, $state, SearchService, $mdMedia, IssueService, GoalService, SolutionService, $timeout, Carousel) {
			// This provides Authentication context.
			$scope.authentication = Authentication;
			$scope.$state = $state;
			$scope.$mdMedia = $mdMedia;

			$scope.message = true;

			// Page title config
			$rootScope.titlePrefix = '';
			$rootScope.titleSuffix = ' | NewVote';

			// Update title and description
			$scope.title = $rootScope.titlePrefix + 'About Us' + $rootScope.titleSuffix;
			$scope.desc = 'NewVote is a dedicated online platform aimed at providing' +
				' balanced, unbiased information on the current federal political issues' +
				' and solutions in Australia. This information is maintained by an in de' +
				'pendent panel and is presented in a simplified and organised manner. It' +
				' also allows people to vote on the solutions, making people\'s opinion ' +
				'available to the decision makers.';
			$rootScope.headerTitle = 'About Us';

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

		}
	]);
