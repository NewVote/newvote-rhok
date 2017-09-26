'use strict';

angular.module('core').factory('activityMonitorInterceptor', ['$rootScope', '$q', '$timeout', function($rootScope, $q, $timeout) {


  $rootScope.requestsPending = false;
  var timer, deferred, numActive = 0;

  function allRequestsCompleted() {
    $rootScope.requestsPending = false;
    if(deferred) {
      deferred.resolve();
      deferred = null;
    }
    numActive = 0;
    timer = null;
  }

  function startRequest() {
    numActive++;
    $rootScope.requestsPending = true;
    if(!deferred) deferred = $q.defer();
    if(timer) $timeout.cancel(timer);
  }

  function endRequest() {
    numActive--;
    if(numActive<1) {
      if(timer) $timeout.cancel(timer);
      timer = $timeout(allRequestsCompleted, 300);
    }
  }

  $rootScope.waitForPendingRequests = function() {
    console.log('waiting for pending requests', numActive, !deferred);
    return deferred ? deferred.promise : $q.resolve();
  };

  return {
    request: function(config) {
      if(!config.background) startRequest();
      return config;
    },
    response: function(response) {
      endRequest();
      return response;
    },
    requestError: function(rejection) {
      endRequest();
      return $q.reject(rejection);
    },
    responseError: function(rejection) {
      endRequest();
      return $q.reject(rejection);
    }
  };
}])

.config(['$httpProvider', function ($httpProvider) {
  //unshift to add interceptor to execute last on return and first on the way out
  $httpProvider.interceptors.unshift('activityMonitorInterceptor');
}]);
