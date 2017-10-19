'use strict';

angular.module('core').service('SocialshareService', ['$window', '$resource', '$httpParamSerializer',
  function ($window, $resource, $httpParamSerializer) {
    var svc = this;

    // Window settings
    svc.windowHeight = 450;
    svc.windowWidth = 600;

    // Social media URLs
    var twitterURL = 'http://twitter.com/share?';
    var facebookURL = 'https://www.facebook.com/sharer/sharer.php?';
    var googlePlusURL = 'https://plus.google.com/share?';
    var linkedinURL = 'https://www.linkedin.com/shareArticle?';
    
    // Facebook
    svc.facebookID = '108325769791251';

    // Twitter
    svc.twitterVia = 'newvote';

    svc.share = function(params) {
      switch(params.provider) {

        case 'facebook':
          params.data.app_id = svc.facebookID;
          openWindow(facebookURL, params.data);
          break;

        case 'twitter':
          params.data.via = svc.twitterVia;
          openWindow(twitterURL, params.data);
          break;

        case 'google_plus':
          openWindow(googlePlusURL, params.data);
          break;

        case 'linkedin':
          openWindow(linkedinURL, params.data);
          break;        
      }
    };
    
    function openWindow(baseURL, params) {
      var queryStr = $httpParamSerializer(params);

      var top = $window.innerHeight / 2 - svc.windowHeight / 2;
      var left = $window.innerWidth / 2 - svc.windowWidth / 2;

      var win = $window.open(
        baseURL + queryStr, 
        '_blank',
        'width=' + svc.windowWidth + ', height=' + svc.windowHeight + ', ' +
        'top=' + top + ', ' +
        'left=' + left + ', ' +
        'toolbar=0, location=0, menubar=0, directories=0, scrollbars=2');
    }
  }
]);
