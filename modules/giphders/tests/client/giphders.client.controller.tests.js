'use strict';

(function () {
  // Giphders Controller Spec
  describe('Giphders Controller Tests', function () {
    // Initialize global variables
    var GiphdersController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Giphders,
      mockGiphder;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Giphders_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Giphders = _Giphders_;

      // create mock giphder
      mockGiphder = new Giphders({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Giphder about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Giphders controller.
      GiphdersController = $controller('GiphdersController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one giphder object fetched from XHR', inject(function (Giphders) {
      // Create a sample giphders array that includes the new giphder
      var sampleGiphders = [mockGiphder];

      // Set GET response
      $httpBackend.expectGET('api/giphders').respond(sampleGiphders);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.giphders).toEqualData(sampleGiphders);
    }));

    it('$scope.findOne() should create an array with one giphder object fetched from XHR using a giphderId URL parameter', inject(function (Giphders) {
      // Set the URL parameter
      $stateParams.giphderId = mockGiphder._id;

      // Set GET response
      $httpBackend.expectGET(/api\/giphders\/([0-9a-fA-F]{24})$/).respond(mockGiphder);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.giphder).toEqualData(mockGiphder);
    }));

    describe('$scope.create()', function () {
      var sampleGiphderPostData;

      beforeEach(function () {
        // Create a sample giphder object
        sampleGiphderPostData = new Giphders({
          title: 'An Giphder about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Giphder about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Giphders) {
        // Set POST response
        $httpBackend.expectPOST('api/giphders', sampleGiphderPostData).respond(mockGiphder);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the giphder was created
        expect($location.path.calls.mostRecent().args[0]).toBe('giphders/' + mockGiphder._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/giphders', sampleGiphderPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock giphder in scope
        scope.giphder = mockGiphder;
      });

      it('should update a valid giphder', inject(function (Giphders) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/giphders\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/giphders/' + mockGiphder._id);
      }));

      it('should set scope.error to error response message', inject(function (Giphders) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/giphders\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(giphder)', function () {
      beforeEach(function () {
        // Create new giphders array and include the giphder
        scope.giphders = [mockGiphder, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/giphders\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockGiphder);
      });

      it('should send a DELETE request with a valid giphderId and remove the giphder from the scope', inject(function (Giphders) {
        expect(scope.giphders.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.giphder = mockGiphder;

        $httpBackend.expectDELETE(/api\/giphders\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to giphders', function () {
        expect($location.path).toHaveBeenCalledWith('giphders');
      });
    });
  });
}());
