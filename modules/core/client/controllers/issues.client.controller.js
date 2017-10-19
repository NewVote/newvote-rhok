'use strict';

angular.module('core').controller('IssuesController', ['$scope', 'Authentication', '$mdSidenav', '$rootScope', '$mdMenu', '$state', 'issues', 'SortService', 'SocialshareService', '$window',
  function ($scope, Authentication, $mdSidenav, $rootScope, $mdMenu, $state, issues, SortService, SocialshareService, $window) {
    // This provides Authentication context.
    var vm = this;
    vm.issues = issues;
    vm.sortSvc = SortService;

    
    SocialshareService.openWindow('https://twitter.com/intent/tweet?text=Example+tweet&via=newvote');

    // Title
    vm.title = 'Issues';
    $rootScope.pageTitle = vm.title;

    // Meta tags
    vm.desc = 'A list of issues';
    vm.image = vm.issues[0].imageUrl;

    vm.sort = function(sortData, $event) {
        if($event) $event.stopPropagation();
        SortService.setSort("issue", sortData.type, sortData.order);
    };
  }
]);
