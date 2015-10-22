/*global gajus, Flash */
'use strict';

// Giphders controller
angular.module('giphders').controller('GiphdersController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'Giphders', 'Flash',
  function ($scope, $stateParams, $http, $location, Authentication, Giphders, Flash) {
    $scope.authentication = Authentication;

    // Find a list of Favorites
    $scope.findFavorites = function () {
      //$scope.favorites = Giphders.query();
      $http.get('/api/favorites/')
        .success(
          function(data,status){
            if(typeof data==='object'){
              $scope.favorites = data;
            }
          }
        )
        .error(
          function(){
            $scope.errorAlert();
          }
        );
    };
    
     // Add favorite
    $scope.addToFavorites = function (giphder, eventObject) {
      console.log('_id: ' + giphder._id + ' added to favorites giphyId: ' + giphder.giphyId);
      // Create new Giphder object
      var giphderFavorite = new Giphders(giphder);
      
      // Remove card after saving
      giphderFavorite.$save(function (response) {
        eventObject.target.remove();
        $scope.approvedAlert();
      }, function (errorResponse) {
        eventObject.target.remove();
        $scope.errorAlert();
      });
    };

    // Find the trending giphy items
    $scope.find = function () {
      $scope.cards = [];
      $http.get('//api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC&limit=100')
        .success(
          function(data,status){
            if(typeof data==='object'){
              angular.forEach(data.data, function(item){
                $scope.cards.push({
                  id: item.id,
                  url: item.images.fixed_width_small.url
                });
              });
            }
          }
        )
        .error(
          function(){
            $scope.errorAlert();
          }
        );
    };
    
    // Remove card
    $scope.remove = function (eventObject) {
      eventObject.target.remove();
      $scope.rejectedAlert();
    };
    
    $scope.approvedAlert = function () {
      var message = '<strong> Well done!</strong>  You saved the giphy to your favorites.';
      Flash.create('success', message, 'customAlert');
    };
    
    $scope.rejectedAlert = function () {
      var message = '<strong> Oh Snap!</strong>  You rejected the giphy.';
      Flash.create('danger', message, 'customAlert');
    };
    
    $scope.errorAlert = function () {
      var message = '<strong> Warning!</strong>  We are screwed. Something went wrong, very wrong..';
      Flash.create('warning', message, 'customAlert');
    };
  }
]);