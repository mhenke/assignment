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
  giphyid: {
    type: String,
    default: '',
    trim: true,
    required: 'Giphyid cannot be blank'
  },
  userid: {
    type: String,
    default: '',
    trim: true,
    required: 'Userid cannot be blank'
  }
});

mongoose.model('Giphder', GiphderSchema);
