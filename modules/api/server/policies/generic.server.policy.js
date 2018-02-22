'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());


var collectionRoutes = ['/api/issues', '/api/goals', '/api/votes', '/api/comments', '/api/solutions', '/api/suggestions', '/api/endorsement', '/api/media', '/api/regions', '/api/countries'];
var objectRoutes = ['/api/issues/:issueId', '/api/goals/:goalId', '/api/votes/:voteId', '/api/comments/:commentId', '/api/solutions/:solutionId', '/api/suggestions/:suggestionId', '/api/endorsement/:endorsementId', '/api/media/:mediaId', '/api/meta/:uri', '/api/regions/:regionId'];
/**
 * Invoke Articles Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: collectionRoutes,
      permissions: '*'
    }, {
      resources: objectRoutes,
      permissions: '*'
    }]
  }, {
    roles: ['endorser'],
    allows: [{
      resources: collectionRoutes,
      permissions: ['get']
    }, {
      resources: objectRoutes,
      permissions: ['get']
  }, {
      resources: ['/api/votes', '/api/suggestions', '/api/endorsement'],
      permissions: ['get', 'post']
  }]
  },{
    roles: ['user'],
    allows: [{
      resources: collectionRoutes,
      permissions: ['get']
    }, {
      resources: objectRoutes,
      permissions: ['get']
  }, {
      resources: ['/api/votes', '/api/suggestions'],
      permissions: ['get', 'post']
  }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: collectionRoutes,
      permissions: ['get']
    }, {
      resources: objectRoutes,
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Articles Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an article is being processed and the current user created it then allow any manipulation
  var object = req.article || req.vote || req.issue || req.goal || req.endorsement || req.comment;
  if (object && req.user && object.user && object.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred.
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else if(!req.user) {
        return res.status(401).json({
          message: 'User is not authenticated'
        });
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
