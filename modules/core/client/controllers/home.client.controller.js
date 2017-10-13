'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$mdSidenav', '$rootScope', '$mdMenu', '$state', 'SearchService', '$mdMedia',
	function ($scope, Authentication, $mdSidenav, $rootScope, $mdMenu, $state, SearchService, $mdMedia) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.$state = $state;
		$scope.$mdMedia = $mdMedia;
		
		$scope.toggleLeft = function () {
			$mdSidenav('left').toggle();
		};
		$rootScope.pageTitle = 'Solution name';

		$scope.openMenu = function ($mdMenu, ev) {
			$mdMenu.open(ev);
		};

		$scope.results = [];

		$scope.searchAll = function (text) {
			$scope.results = SearchService.searchAll(text);
		};

		$scope.getItemTitle = function (item) {
			return SearchService.getItemTitle(item);
		};

		$scope.getHyperLink = function (item) {
			return SearchService.getHyperLink(item);
		};

		$scope.searchOpen = false;

		$scope.openSearch = function () {
			$scope.searchOpen = !$scope.searchOpen;
			console.log($scope.searchOpen);
		};
	}
]);
