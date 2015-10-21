'use strict';

// Configuring the Giphders module
angular.module('giphders').run(['Menus',
  function (Menus) {
    // Add the giphders dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Menu',
      state: 'giphders',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'giphders', {
      title: 'Gifs',
      state: 'giphders.gifs',
      roles: ['user']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'giphders', {
      title: 'Favorites',
      state: 'giphders.favorites',
      roles: ['user']
    });
  }
]);
