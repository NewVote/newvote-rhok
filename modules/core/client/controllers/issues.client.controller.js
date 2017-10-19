'use strict';

angular.module('core').controller('IssuesController', ['$scope', 'Authentication', '$mdSidenav', '$rootScope', '$mdMenu', '$state', 'issues', 'SortService', 'SocialshareService', '$window',
  function ($scope, Authentication, $mdSidenav, $rootScope, $mdMenu, $state, issues, SortService, SocialshareService, $window) {
    // This provides Authentication context.
    var vm = this;
    vm.issues = issues;
    vm.sortSvc = SortService;

    
    // SocialshareService.share({
    //   provider: 'facebook',
    //   data: {
    //     u: 'http://prototype.newvote.org.au/issues/59a238a4cb407514009a5fef'
    //   }
    // });
    // Facebook only needs a url

    // SocialshareService.share({
    //   provider: 'twitter',
    //   data: {
    //     text: '',
    //     url: 'http://prototype.newvote.org.au/issues/59a238a4cb407514009a5fef',
    //     hashtags: 'one, two, three'
    //   }
    // });

    // SocialshareService.share({
    //   provider: 'google_plus',
    //   data: {
    //     url: 'http://prototype.newvote.org.au/issues/59a238a4cb407514009a5fef',
    //     hl: 'en-GB'
    //   }
    // });

    // SocialshareService.share({
    //   provider: 'google_plus',
    //   data: {
    //     url: 'http://prototype.newvote.org.au/issues/59a238a4cb407514009a5fef',
    //     hl: 'en-GB'
    //   }
    // });

    SocialshareService.share({
      provider: 'linkedin',
      data: {
        url: 'http://prototype.newvote.org.au/issues/59a238a4cb407514009a5fef'
      }
    });



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
