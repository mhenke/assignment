'use strict';

/**
 * Module dependencies.
 */
var giphdersPolicy = require('../policies/giphders.server.policy'),
  giphders = require('../controllers/giphders.server.controller');

module.exports = function (app) {
  // Giphders collection routes
  app.route('/api/giphders').all(giphdersPolicy.isAllowed)
    .get(giphders.list);

  // Single giphder routes
  app.route('/api/giphders/:_id/:giphyId').all(giphdersPolicy.isAllowed)
    .put(giphders.create)
    .delete(giphders.delete);

  // Finish by binding the giphder middleware
  app.param('_id', giphders.giphderByID);
  app.param('giphyId', giphders.giphderByID);
};
