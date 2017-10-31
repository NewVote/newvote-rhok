'use strict';

angular.module('core').service('MediaService', ['$resource', '$stateParams', '$q', '_',
	function ($resource, $stateParams, $q, _) {
		var Media = $resource('api/media/:mediaId', {
			mediaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});

		var Meta = $resource('api/meta/:uri', {
			uri: '@url'
		});

		var svc = this;

		svc.get = function (mediaId) {
			return Media.get({
				mediaId: mediaId
			}).$promise;
		};

		svc.list = function (params) {
			return Media.query(params).$promise;
		};

		svc.delete = function (mediaId) {
			var media = new Media({
				_id: mediaId
			});
			return media.$remove();
		};

		svc.createOrUpdate = function (mediaObj) {
			var media = new Media(mediaObj);
			return media._id ? media.$update() : media.$save();
		};

		svc.getMeta = function (url) {
			return Meta.get({
				uri: url
			});
		};
	}
]);
