'use strict';

angular.module('core').controller('TopicController', ['$scope', 'Authentication', '$mdSidenav', '$rootScope', '$mdMenu', '$state',
  function ($scope, Authentication, $mdSidenav, $rootScope, $mdMenu, $state) {
    // This provides Authentication context.
    var vm = this;
    vm.topic = 'TESTING 123456';
  }
]);
