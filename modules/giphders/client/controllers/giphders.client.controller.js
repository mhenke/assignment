/*global gajus, Flash */
'use strict';

// Giphders controller
angular.module('giphders').controller('GiphdersController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'Giphders', 'Flash',
  function ($scope, $stateParams, $http, $location, Authentication, Giphders, Flash) {
    $scope.authentication = Authentication;

    // Find a list of Favorites
    $scope.findFavorites = function () {
      $scope.favorites = Giphders.query(function (response) {
        for(var i = 0; i < $scope.favorites.length; i++){
          if (i === 0) {
            $scope.textToCopy = 'https://media1.giphy.com/media/'+ $scope.favorites[i].giphyid + '/100.gif';
          } else {
            $scope.textToCopy = $scope.textToCopy + ', https://media1.giphy.com/media/'+ $scope.favorites[i].giphyid + '/100.gif';
          }
        }
        $scope.countFav = $scope.favorites.length;
      }, function (errorResponse) {
        $scope.errorAlert();
      });
    };

    // Find the trending giphy items
    $scope.find = function () {
      $scope.cards = [];
      $scope.offset = 0;
      $http.get('//api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC&limit=10')
        .success(
          function(data,status){
            if(typeof data==='object'){
              angular.forEach(data.data.reverse(), function(item){
                $scope.cards.push({
                  id: item.id,
                  url: item.images.fixed_width_small.url
                });
              });
              //last card
             $scope.cards.unshift({
                id: 'lastCard',
                url: 'https://placeholdit.imgix.net/~text?txtsize=33&w=100&h=50'
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
    
    // Find the next set of trending giphy items
    $scope.findNext = function () {
      $scope.cards.pop();
      if ($scope.offset < 100) {
        if ($scope.cards.length === 1) {
          $scope.offset = $scope.offset + 10;
          $http.get('//api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC&limit=10&offset='+$scope.offset)
          .success(
            function(data,status){
              if(typeof data==='object'){
                angular.forEach(data.data.reverse(), function(item){
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
        }
      } else {
        $scope.lifeAlert();
      };
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
        $scope.errorAlert();
      });
      $scope.findNext();
    };
    
    // Reject card
    $scope.rejectCard = function (eventObject) {
      $scope.rejectedAlert();
      $scope.findNext();
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
        $scope.findFavorites();
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
      Flash.create('warning', message, 'customAlert');
    };
    
    $scope.errorAlert = function () {
      var message = '<strong> Warning!</strong>  We are screwed. Something went wrong, very wrong..';
      Flash.create('danger', message, 'customAlert');
    };
    
    $scope.removeAlert = function () {
      var message = '<strong> You Go, Girl!</strong>  You removed the giphy from your favorites.';
      Flash.create('warning', message, 'customAlert');
    };
    
    $scope.removeAllAlert = function () {
      var message = '<strong> That awkward moment,</strong>  when you realize you cleared your favorites.';
      Flash.create('warning', message, 'customAlert');
    };
    
    $scope.copyAlert = function () {
      var message = '<strong> Outstanding!</strong>  You copied your favorites to the clipboard.';
      Flash.create('info', message, 'customAlert');
    };
    
    $scope.lifeAlert = function () {
      var message = '<strong> Push Away!</strong>  You have to get a life please.';
      Flash.create('danger', message, 'customAlert');
    };
  }
]);