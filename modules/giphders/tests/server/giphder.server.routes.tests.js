'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Giphder = mongoose.model('Giphder'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, giphder;

/**
 * Giphder routes tests
 */
describe('Giphder CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new giphder
    user.save(function () {
      giphder = {
        title: 'Giphder Title',
        content: 'Giphder Content'
      };

      done();
    });
  });

  it('should be able to save an giphder if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new giphder
        agent.post('/api/giphders')
          .send(giphder)
          .expect(200)
          .end(function (giphderSaveErr, giphderSaveRes) {
            // Handle giphder save error
            if (giphderSaveErr) {
              return done(giphderSaveErr);
            }

            // Get a list of giphders
            agent.get('/api/giphders')
              .end(function (giphdersGetErr, giphdersGetRes) {
                // Handle giphder save error
                if (giphdersGetErr) {
                  return done(giphdersGetErr);
                }

                // Get giphders list
                var giphders = giphdersGetRes.body;

                // Set assertions
                (giphders[0].user._id).should.equal(userId);
                (giphders[0].title).should.match('Giphder Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an giphder if not logged in', function (done) {
    agent.post('/api/giphders')
      .send(giphder)
      .expect(403)
      .end(function (giphderSaveErr, giphderSaveRes) {
        // Call the assertion callback
        done(giphderSaveErr);
      });
  });

  it('should not be able to save an giphder if no title is provided', function (done) {
    // Invalidate title field
    giphder.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new giphder
        agent.post('/api/giphders')
          .send(giphder)
          .expect(400)
          .end(function (giphderSaveErr, giphderSaveRes) {
            // Set message assertion
            (giphderSaveRes.body.message).should.match('Title cannot be blank');

            // Handle giphder save error
            done(giphderSaveErr);
          });
      });
  });

  it('should be able to update an giphder if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new giphder
        agent.post('/api/giphders')
          .send(giphder)
          .expect(200)
          .end(function (giphderSaveErr, giphderSaveRes) {
            // Handle giphder save error
            if (giphderSaveErr) {
              return done(giphderSaveErr);
            }

            // Update giphder title
            giphder.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing giphder
            agent.put('/api/giphders/' + giphderSaveRes.body._id)
              .send(giphder)
              .expect(200)
              .end(function (giphderUpdateErr, giphderUpdateRes) {
                // Handle giphder update error
                if (giphderUpdateErr) {
                  return done(giphderUpdateErr);
                }

                // Set assertions
                (giphderUpdateRes.body._id).should.equal(giphderSaveRes.body._id);
                (giphderUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of giphders if not signed in', function (done) {
    // Create new giphder model instance
    var giphderObj = new Giphder(giphder);

    // Save the giphder
    giphderObj.save(function () {
      // Request giphders
      request(app).get('/api/giphders')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single giphder if not signed in', function (done) {
    // Create new giphder model instance
    var giphderObj = new Giphder(giphder);

    // Save the giphder
    giphderObj.save(function () {
      request(app).get('/api/giphders/' + giphderObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', giphder.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single giphder with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/giphders/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Giphder is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single giphder which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent giphder
    request(app).get('/api/giphders/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No giphder with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an giphder if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new giphder
        agent.post('/api/giphders')
          .send(giphder)
          .expect(200)
          .end(function (giphderSaveErr, giphderSaveRes) {
            // Handle giphder save error
            if (giphderSaveErr) {
              return done(giphderSaveErr);
            }

            // Delete an existing giphder
            agent.delete('/api/giphders/' + giphderSaveRes.body._id)
              .send(giphder)
              .expect(200)
              .end(function (giphderDeleteErr, giphderDeleteRes) {
                // Handle giphder error error
                if (giphderDeleteErr) {
                  return done(giphderDeleteErr);
                }

                // Set assertions
                (giphderDeleteRes.body._id).should.equal(giphderSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an giphder if not signed in', function (done) {
    // Set giphder user
    giphder.user = user;

    // Create new giphder model instance
    var giphderObj = new Giphder(giphder);

    // Save the giphder
    giphderObj.save(function () {
      // Try deleting giphder
      request(app).delete('/api/giphders/' + giphderObj._id)
        .expect(403)
        .end(function (giphderDeleteErr, giphderDeleteRes) {
          // Set message assertion
          (giphderDeleteRes.body.message).should.match('User is not authorized');

          // Handle giphder error error
          done(giphderDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Giphder.remove().exec(done);
    });
  });
});
