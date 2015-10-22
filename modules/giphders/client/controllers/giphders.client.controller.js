/*global gajus, Flash */
'use strict';

// Giphders controller
angular.module('giphders').controller('GiphdersController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'Giphders', 'Flash',
  function ($scope, $stateParams, $http, $location, Authentication, Giphders, Flash) {
    $scope.authentication = Authentication;

    // Find a list of Favorites
    $scope.findFavorites = function () {
      //$scope.favorites = Giphders.query();
      //giphders.find({ 'userid': '5626d34a09f4bc4141bc62fe' })
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
      
      // remove item after saving
      giphderFavorite.$save(function (response) {
        eventObject.target.remove();
        $scope.approvedAlert();
      }, function (errorResponse) {
        eventObject.target.remove();
        $scope.errorAlert();
      });
      
    };

    // Find a list of Giphders
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
    
    // Remove Giphder card
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
      var message = '<strong> Warning!</strong>  We are screwed, something went wrong, very wrong..';
      Flash.create('warning', message, 'customAlert');
    };
  }
]);