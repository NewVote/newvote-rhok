'use strict';

angular.module('users')
	.service('VerificationService', ['$resource', '$stateParams', '$q', '_',
		function ($resource, $stateParams, $q, _) {

            var SendSMS = $resource('api/users/sms', {}, {
                send: {
                    method: 'POST'
                }
            });

			var Verification = $resource('api/users/verify', {}, {
				verify: {
					method: 'POST'
				}
            });

            var svc = this;

			svc.sendSMS = function (params) {
				return SendSMS.send(params)
					.$promise;
			};

			svc.verify = function(params) {
				return Verification.verify(params)
					.$promise;
			};
		}
	]);
