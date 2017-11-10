'use strict';

angular.module('core').factory('authInterceptor', ['$q', '$injector', '$rootScope',
	function ($q, $injector, $rootScope) {
        var req;
		return {
			request: function (config) {
                req = config;
                return config;
			},
            response: function(response) {
                req = null;
                return response;
            },
			responseError: function (rejection) {
				if (rejection.config && !rejection.config.ignoreAuthModule) {
					switch (rejection.status) {
					case 401:
                        var prev = req,
                        $http = $injector.get('$http'),
						$localStorage = $injector.get('$localStorage');

                        $rootScope.$on('login:success', function(event, data) {
                            // console.log('user has now logged in, re-sending previous request: ', prev);
							//have to clear out pendingVotes because that is only used with oAuth logins
							delete $localStorage.pendingVotes;
                            $http(prev);
                            prev = null;
                        });
						$injector.get('$state').go('authentication.signin');
						break;
					case 403:
						$injector.get('$state').go('forbidden');
						break;
					}
				}
				// otherwise, default behaviour
				return $q.reject(rejection);
			}
		};
	}
]);
