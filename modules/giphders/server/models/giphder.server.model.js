'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Giphder Schema
 */
var GiphderSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  _id: {
    type: String,
    default: '',
    trim: true,
    required: 'Id cannot be blank'
  },
  giphyId: {
    type: String,
    default: '',
    trim: true,
    required: 'GiphyId cannot be blank'
  }
});

mongoose.model('Giphder', GiphderSchema);
