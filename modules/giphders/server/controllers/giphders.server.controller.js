'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Giphder = mongoose.model('Giphder'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a giphder
 */
exports.create = function (req, res) {
  var giphder = new Giphder(req.body);
  giphder.user = req.user;

  giphder.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(giphder);
    }
  });
};

/**
 * Show the current giphder
 */
exports.read = function (req, res) {
  res.json(req.giphder);
};

/**
 * Update a giphder
 */
exports.update = function (req, res) {
  var giphder = req.giphder;

  giphder.title = req.body.title;
  giphder.content = req.body.content;

  giphder.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(giphder);
    }
  });
};

/**
 * Delete an giphder
 */
exports.delete = function (req, res) {
  var giphder = req.giphder;

  giphder.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(giphder);
    }
  });
};

/**
 * List of Giphders
 */
exports.list = function (req, res) {
  Giphder.find().sort('-created').populate('user', 'displayName').exec(function (err, giphders) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(giphders);
    }
  });
};

/**
 * List of Favorites by userID
 */
exports.listFavorites = function (req, res) {
  Giphder.find({ userid: req._passport.session.user }).exec(function (err, giphders) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(giphders);
    }
  });
};

/**
 * Giphder middleware
 */
exports.giphderByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Giphder is invalid'
    });
  }

  Giphder.findById(id).populate('user', 'displayName').exec(function (err, giphder) {
    if (err) {
      return next(err);
    } else if (!giphder) {
      return res.status(404).send({
        message: 'No giphder with that identifier has been found'
      });
    }
    req.giphder = giphder;
    next();
  });
};
