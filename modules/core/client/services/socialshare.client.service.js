'use strict';

angular.module('core').service('SocialshareService', ['$window', '$resource', '$httpParamSerializer', '$location',
  function ($window, $resource, $httpParamSerializer, $location) {
    var svc = this;

    // Window settings
    svc.windowHeight = 450;
    svc.windowWidth = 600;

    // Social media settings
    var prefix = 'NewVote | ';
    var suffix = '';

    // Social media URLs
    var twitterURL = 'http://twitter.com/share?';
    var facebookURL = 'https://www.facebook.com/sharer/sharer.php?';
    var googlePlusURL = 'https://plus.google.com/share?';
    var linkedinURL = 'https://www.linkedin.com/shareArticle?';
    var redditURL = 'http://www.reddit.com/submit?';
    svc.hostURL = getHostURL();
    
    // Facebook
    svc.facebookID = '108325769791251';

    // Twitter
    svc.twitterVia = 'NewVoteAus';

    svc.share = function(params) {
      
      var url = svc.hostURL + params.rel_url;
      
      switch(params.provider) {

        case 'facebook':
          openWindow(facebookURL, {
            app_id: svc.facebookID,
            u: url
          });
          break;

        case 'twitter':
          openWindow(twitterURL, {
            via: svc.twitterVia,
            text: prefix + params.title + suffix,
            url: url,
            hashtags: params.hashtags
          });
          break;

        case 'google_plus':
          openWindow(googlePlusURL, {
            url: url,
            hl: 'en-GB'
          });
          break;

        case 'linkedin':
          openWindow(linkedinURL, {
            url: url
          });
          break;   
          
        case 'reddit':
          openWindow(redditURL, {
            url: url,
            title: prefix + params.title + suffix
          });
          break;
      }
    };

    function getHostURL() {
      return $location.protocol() + '://' + $location.host();
    }
    
    function openWindow(baseURL, params) {
      var queryStr = $httpParamSerializer(params);

      var top = ($window.innerHeight / 2) - (svc.windowHeight / 2);
      var left = ($window.innerWidth / 2) - (svc.windowWidth / 2);

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
