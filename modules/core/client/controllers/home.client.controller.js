'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$mdSidenav', '$rootScope', '$mdMenu', '$state', 'SearchService', '$mdMedia',
	function ($scope, Authentication, $mdSidenav, $rootScope, $mdMenu, $state, SearchService, $mdMedia) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.$state = $state;
		$scope.$mdMedia = $mdMedia;
		$rootScope.pageTitle = 'Solution name';
		// Title
    $scope.title = 'NewVote Home';

    // Meta tags
    $scope.desc = 'NewVote is a dedicated online platform aimed at providing' +
    ' balanced, unbiased information on the current federal political issues' +
    ' and solutions in Australia. This information is maintained by an in de' +
    'pendent panel and is presented in a simplified and organised manner. It' +
    ' also allows people to vote on the solutions, making people\'s opinion ' +
    'available to the decision makers.';


		$scope.toggleLeft = function () {
			$mdSidenav('left').toggle();
		};
		$rootScope.pageTitle = 'Solution name';

		$scope.openMenu = function ($mdMenu, ev) {
			$mdMenu.open(ev);
		};

		$scope.results = [];

    $scope.getHyperLink = function(item) {
      return SearchService.getHyperLink(item);
    };

		$scope.searchOpen = false;

		$scope.openSearch = function () {
			$scope.searchOpen = !$scope.searchOpen;
			console.log($scope.searchOpen);
		};
	}
]);
