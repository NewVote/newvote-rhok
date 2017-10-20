'use strict';

angular.module('core').service('SocialshareService', ['$window', '$resource', '$httpParamSerializer', '$location',
  function ($window, $resource, $httpParamSerializer, $location) {
    var svc = this;

    // Window settings
    svc.windowHeight = 450;
    svc.windowWidth = 600;

    // Social media URLs
    var twitterURL = 'http://twitter.com/share?';
    var facebookURL = 'https://www.facebook.com/sharer/sharer.php?';
    var googlePlusURL = 'https://plus.google.com/share?';
    var linkedinURL = 'https://www.linkedin.com/shareArticle?';
    var redditURL = 'http://www.reddit.com/submit?';
    svc.baseURL = $location.absUrl();
    
    // Facebook
    svc.facebookID = '108325769791251';

    // Twitter
    svc.twitterVia = 'NewVoteAus';

    

    svc.share = function(params) {

      switch(params.provider) {

        case 'facebook':
          openWindow(facebookURL, {
            app_id: svc.facebookID,
            u: svc.baseURL + params.rel_url
          });
          break;

        case 'twitter':
          openWindow(twitterURL, {
            via: svc.twitterVia,
            text: 'NewVote | ' + params.title,
            url: svc.baseURL + params.rel_url,
            hashtags: params.hashtags
          });
          break;

        case 'google_plus':
          openWindow(googlePlusURL, {
            url: svc.baseURL + params.rel_url,
            hl: 'en-GB'
          });
          break;

        case 'linkedin':
          openWindow(linkedinURL, {
            url: svc.baseURL + params.rel_url
          });
          break;   
          
        case 'reddit':
          openWindow(redditURL, {
            url: svc.baseURL + params.rel_url,
            title: 'NewVote | ' + params.title
          });
          break;
      }
    };
    
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
