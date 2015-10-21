/*global gajus */
'use strict';

// Giphders controller
angular.module('giphders').controller('GiphdersController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'Giphders',
  function ($scope, $stateParams, $http, $location, Authentication, Giphders) {
    $scope.authentication = Authentication;

    // Create new Giphder
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'giphderForm');

        return false;
      }

      // Create new Giphder object
      var giphder = new Giphders({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      giphder.$save(function (response) {
        $location.path('giphders/' + response._id + '/' + response.giphyId);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Giphder
    $scope.remove = function (giphder) {
      if (giphder) {
        giphder.$remove();

        for (var i in $scope.giphders) {
          if ($scope.giphders[i] === giphder) {
            $scope.giphders.splice(i, 1);
          }
        }
      } else {
        $scope.giphder.$remove(function () {
          $location.path('giphders');
        });
      }
    };
    
    // Find a list of Favorites
    $scope.findFavorites = function () {
      $scope.favorites = Giphders.query();
    };
    
     // Add favorite
    $scope.addToFavorites = function (giphder, eventObject) {
      // alert(giphder._id + ' added to favorites ' + giphder.giphyId);
      // Create new Giphder object
      var giphderFavorite = new Giphders(giphder);
      
      // remove item after saving
      giphderFavorite.$save(function (response) {
        eventObject.target.remove();
      }, function (errorResponse) {
        eventObject.target.remove();
        alert('error saving');
      });
      
    };

    // Update existing Giphder
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'giphderForm');

        return false;
      }

      var giphder = $scope.giphder;

      giphder.$update(function () {
        $location.path('giphders/' + giphder._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Giphders
    $scope.find = function () {
      $scope.cards = [];
      $http.get('//api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC&limit=5')
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
            $scope.error = 'Failed to access';
          }
        );
    };
    
    $scope.remove = function (eventObject) {
      eventObject.target.remove();
    };
    
    // Find existing Giphder
    $scope.findOne = function () {
      $scope.giphder = Giphders.get({
        _id: $stateParams._id,
        giphyId: $stateParams.giphyId
      });
    };
  }
]);
