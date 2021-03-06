'use strict';

/**
 * Module dependencies.
 */
var giphdersPolicy = require('../policies/giphders.server.policy'),
  giphders = require('../controllers/giphders.server.controller');

module.exports = function (app) {
  // Giphders collection routes
  app.route('/api/giphders').all(giphdersPolicy.isAllowed)
    .delete(giphders.deleteAll)
    .get(giphders.listFavorites);
    
  // Single giphder routes
  app.route('/api/giphders/:giphderId').all(giphdersPolicy.isAllowed)
    .get(giphders.read)
    .put(giphders.update)
    .delete(giphders.delete)
    .post(giphders.create);
    
  // Finish by binding the giphder middleware
  // app.param('giphderId', giphders.giphderByID);
};
