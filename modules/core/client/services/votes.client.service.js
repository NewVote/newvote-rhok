'use strict';

angular.module('core').service('VoteService', ['$resource', '$state', '$stateParams', '$q', '_', 'VOTE_TYPES', '$localStorage',
	function ($resource, $state, $stateParams, $q, _, VOTE_TYPES, $localStorage) {
		var Vote = $resource('api/votes/:voteId', {
			voteId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});

		var svc = this;

		svc.createOrUpdate = function (voteObj) {
			var vote = new Vote(voteObj);
			return vote._id ? vote.$update() : vote.$save();
		};

		svc.vote = function (object, objectType, voteType) {
			console.log('new vote from vote service');
			console.log('vote object: ', object);
			if (object.votes) {
				var existingVote = object.votes.currentUser;
				var voteValue = VOTE_TYPES[voteType];
				if (existingVote) {
					voteValue = existingVote.voteValue === voteValue ? VOTE_TYPES.cancel : voteValue;
				}
				var vote = {
					object: object._id,
					objectType: objectType,
					voteValue: voteValue
				};
				object.votes.currentUser = vote;

				return svc.createOrUpdate(vote).then(function(data) {
					console.log('vote data: ', data);
					return data;
				}, function (err) {
					console.log('Error saving vote: ', err.data.message);
					console.log(err);
					if(err.status === 401){
						if(!$localStorage.pendingVotes){
							$localStorage.pendingVotes = [];
						}
						$localStorage.pendingVotes.push({
							object: object,
							objectType: objectType,
							voteType: voteType
						});
						console.log($localStorage);
					}
					object.votes.currentUser = existingVote;
				});
			}else {
				console.log('there was no .votes');
			}
		};
	}
]);
