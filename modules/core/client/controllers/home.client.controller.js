'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$mdSidenav', '$rootScope', '$mdMenu', '$state', 'SearchService',
  function ($scope, Authentication, $mdSidenav, $rootScope, $mdMenu, $state, SearchService) {
    // This provides Authentication context.

    $scope.authentication = Authentication;
    $scope.$state = $state;
    $scope.toggleLeft = function() {
      $mdSidenav('left').toggle();
    };
    $rootScope.pageTitle = 'Solution name';

    $scope.openMenu = function($mdMenu, ev) {
      $mdMenu.open(ev);
    };

    $scope.results = [];

    $scope.searchAll = function(text) {
      $scope.results = SearchService.searchAll(text);
    };

    $scope.getItemTitle = function(item) {
      return SearchService.getItemTitle(item);
    };

    $scope.redirectTo = function(item) {
      SearchService.redirectTo(item);
    };

    // Title
    $scope.title = 'Home';
    
    // Meta tags
    $scope.desc = 'Home of NewVote';
    // $scope.image = vm.solutions[0].imageUrl;
    
  }
]);
