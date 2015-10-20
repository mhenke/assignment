'use strict';

// Setting up route
angular.module('giphders').config(['$stateProvider',
  function ($stateProvider) {
    // Giphders state routing
    $stateProvider
      .state('giphders', {
        abstract: true,
        url: '/giphders',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('giphders.gifs', {
        url: '',
        templateUrl: 'modules/giphders/client/views/gifs-giphders.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('giphders.favorites', {
        url: '/favorites',
        templateUrl: 'modules/giphders/client/views/favorites-giphder.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('giphders.view', {
        url: '/:giphyId',
        templateUrl: 'modules/giphders/client/views/view-giphder.client.view.html'
      });
  }
]);
