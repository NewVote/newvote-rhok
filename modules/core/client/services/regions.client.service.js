'use strict';

angular.module('core').service('RegionService', ['$resource', '$stateParams', '$q', '_',
	function ($resource, $stateParams, $q, _) {

    var Regions = $resource('api/regions/');

		var svc = this;

		svc.list = function (params) {
			return Regions.query(params).$promise;
    };
    
    svc.searchRegions = function (query) {
			return svc.list({
				search: query
			});
		};
	}
]);
