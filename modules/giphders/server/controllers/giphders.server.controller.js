'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Giphder = mongoose.model('Giphder'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Add to favorites by userid
 */
exports.create = function (req, res) {
  var giphder = new Giphder();
  
  giphder.userid = req._passport.session.user;
  giphder.giphyid = req.params.giphderId;

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
 * Show the current article
 */
exports.read = function (req, res) {
  res.json(req.giphder);
};

/**
 * Update a article
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
 * Delete all giphder for user
 */
exports.deleteAll = function (req, res) {
  Giphder.remove({ userid: req._passport.session.user }).exec(function (err, giphders) {
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
 * Delete an giphder
 */
exports.delete = function (req, res) {
  var giphder = new Giphder();

  giphder._id = req.params.giphderId;
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
 * List of Favorites by user
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
 * List of Favorites by user
 */
exports.read = function (req, res) {
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

  Giphder.findById(id).exec(function (err, giphder) {
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
