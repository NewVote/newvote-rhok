'use strict';

angular.module('core').service('VoteService', ['$resource', '$stateParams', '$q', '_', 'VOTE_TYPES',
  function ($resource, $stateParams, $q, _, VOTE_TYPES) {
    var Vote = $resource('api/votes/:voteId', { voteId: '@_id' }, { update: { method: 'PUT' } });

    var svc = this;

    svc.createOrUpdate = function(voteObj) {
      var vote = new Vote(voteObj);
      return vote._id ? vote.$update() : vote.$save();
    };

    svc.vote = function(object, objectType, voteType) {
      var voteValue = VOTE_TYPES[voteType];
      var existingVote = object.currentUserVote;
      if(existingVote) {
        voteValue = existingVote.voteValue===voteValue ? VOTE_TYPES.cancel : voteValue;
      }
      var vote = {
        object: object._id,
        objectType: objectType,
        voteValue: voteValue
      };
      object.currentUserVote = vote;

      svc.createOrUpdate(vote).then(null, function(err) {
        console.log('Error saving vote', err);
        object.currentUserVote = existingVote;
      });
    };
  }
]);
