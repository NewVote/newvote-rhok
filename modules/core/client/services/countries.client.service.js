'use strict';

angular.module('core')
	.service('CountryService', ['$resource', '$stateParams', '$q', '_',
		function ($resource, $stateParams, $q, _) {

			var Countries = $resource('api/countries/');

			var svc = this;

			svc.list = function (params) {
				return Countries.query(params)
					.$promise;
			};

			svc.searchCountries = function (query) {
				return svc.list({
					search: query
				});
			};
		}
	]);
