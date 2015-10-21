'use strict';

//Giphders service used for communicating with the giphders REST endpoints
angular.module('giphders').factory('Giphders', ['$resource',
  function ($resource) {
    return $resource('api/giphders/:giphyId', {
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