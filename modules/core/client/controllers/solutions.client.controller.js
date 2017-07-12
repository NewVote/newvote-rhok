'use strict';

angular.module('core').controller('SolutionsListController', ['$scope', 'Authentication', '$mdSidenav', '$rootScope', '$mdMenu', '$state',
  function ($scope, Authentication, $mdSidenav, $rootScope, $mdMenu, $state) {
    // This provides Authentication context.
    var vm = this;

    vm.solutions = [{
      id: 0,
      name: 'Global Warming',
      imageUrl: 'modules/core/client/img/1.png'
    },
    {
      id: 1,
      name: 'Global Warming',
      imageUrl: 'modules/core/client/img/1.png'
    },
    {
      id: 2,
      name: 'Global Warming',
      imageUrl: 'modules/core/client/img/1.png'
    },
    {
      id: 3,
      name: 'Global Warming',
      imageUrl: 'modules/core/client/img/1.png'
    },
    {
      id: 4,
      name: 'Global Warming',
      imageUrl: 'modules/core/client/img/1.png'
    },
    {
      id: 5,
      name: 'Global Warming',
      imageUrl: 'modules/core/client/img/1.png'
    },
    {
      id: 6,
      name: 'Global Warming',
      imageUrl: 'modules/core/client/img/1.png'
    }
    ];

    $scope.openMenu = function($mdMenu, ev) {
      $mdMenu.open(ev);
    };
  }
]);