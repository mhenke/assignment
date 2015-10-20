'use strict';

//Giphders service used for communicating with the giphders REST endpoints
angular.module('giphders').factory('Giphders', ['$resource',
  function ($resource) {
    return $resource('api/giphders/:_id/:giphyId', {
      _id: '@_id',
      giphyId: '@giphyId'
    }, {
      update: {
        method: 'PUT'
      }
    }, {
      list: {
        method: 'PUT'
      }
    });
  }
]);
