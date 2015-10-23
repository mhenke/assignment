/*global gajus, Flash */
'use strict';

// Giphders controller
angular.module('giphders').controller('GiphdersController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'Giphders', 'Flash',
  function ($scope, $stateParams, $http, $location, Authentication, Giphders, Flash) {
    $scope.authentication = Authentication;

    // Find a list of Favorites
    $scope.findFavorites = function () {
      $scope.favorites = Giphders.query(function (response) {
        $scope.countFav = $scope.favorites.length;
      }, function (errorResponse) {
        $scope.errorAlert();
      });
    };
    
     // Add favorite
    $scope.addToFavorites = function (giphyId, eventObject) {
      // Create new Giphder object
      var giphderFavorite = new Giphders({ 'giphyId':giphyId });
      
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
    
    // Reject card
    $scope.rejectCard = function (eventObject) {
      eventObject.target.remove();
      $scope.rejectedAlert();
    };
    
    // Remove favorite item
    $scope.clearAll = function(){
      // remove all by userid
      var giphderFavorite = new Giphders();
      
      giphderFavorite.$delete(function (response) {
        $scope.removeAllAlert();
        $scope.countFav = 0;
      }, function (errorResponse) {
        $scope.errorAlert();
      });
    };
    
    // Remove favorite item
    $scope.remove = function(favorite, e){
      var giphderFavorite = new Giphders({ 'giphyId':favorite._id });
      var checkElement = e.target.parentNode.parentNode;

      giphderFavorite.$delete(function (response) {
        if (angular.element(checkElement.parentNode).hasClass('favimg')) {
          checkElement.parentNode.remove();
        } else {
          checkElement.remove();
        }
        $scope.removeAlert();
        $scope.countFav = $scope.countFav-1;
      }, function (errorResponse) {
        $scope.errorAlert();
      });
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
    
    $scope.removeAlert = function () {
      var message = '<strong> You Go, Girl!</strong>  You removed the giphy from your favorites.';
      Flash.create('info', message, 'customAlert');
    };
    
    $scope.removeAllAlert = function () {
      var message = '<strong> You Go, Girl!</strong>  You cleared your favorites.';
      Flash.create('info', message, 'customAlert');
    };
  }
]);