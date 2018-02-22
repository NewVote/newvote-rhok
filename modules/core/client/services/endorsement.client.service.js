'use strict';

angular.module('core').service('EndorsementService', ['$resource', '$stateParams', '$q', '_',
	function ($resource, $stateParams, $q, _) {
		var Endorsement = $resource('api/endorsement/:endorsementId', {
			endorsementId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});

		var svc = this;

		svc.get = function (endorsementId) {
			return Endorsement.get({
				endorsementId: endorsementId
			}).$promise;
		};

		svc.list = function (params) {
			return Endorsement.query(params).$promise;
		};

		svc.delete = function (endorsementId) {
			var endorsement = new Endorsement({
				_id: endorsementId
			});
			return endorsement.$remove();
		};

		svc.createOrUpdate = function (endorsementObj) {
			var endorsement = new Endorsement(endorsementObj);
			return endorsement._id ? endorsement.$update() : endorsement.$save();
		};
		
	}
]);
