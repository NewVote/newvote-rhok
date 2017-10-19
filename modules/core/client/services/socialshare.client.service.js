'use strict';

angular.module('core').service('SocialshareService', ['$window',
  function ($window) {
    var svc = this;
    svc.windowHeight = 450;
    svc.windowWidth = 600;
    
    // Facebook
    svc.facebookID = '108325769791251';

    // Twitter
    svc.twitterUser = 'newvote';
    
    svc.openWindow = function(url) {
      var top = $window.innerHeight / 2 - svc.windowHeight / 2;
      var left = $window.innerWidth / 2 - svc.windowWidth / 2;
      $window.open(
        url, 
        '_blank',
        'width=' + svc.windowWidth + ', height=' + svc.windowHeight + ', ' +
        'top=' + top + ', ' +
        'left=' + left + ', ' +
        'toolbar=0, location=0, menubar=0, directories=0, scrollbars=2');
    };
  }
]);
