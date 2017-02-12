'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';
import User from '../user/user.model';
import Adventure from './adventure.model';

var newAdventure;

describe('Adventure API:', function() {
  var user;
  var admin;
  var userToken;
  var adminToken;

  // Clear users before testing
  before(function() {
    return User.remove()
    .then(function() {
      user = new User({
        name: 'Fake User',
        email: 'test@example.com',
        password: 'password'
      });

      return user.save();
    })
    .then(function() {
      admin = new User({
        name: 'Fake User',
        email: 'admin@example.com',
        password: 'admin',
        role: 'admin',
      });

      return admin.save();
    });
  });

  // User login
  before(function(done) {
    request(app)
      .post('/auth/local')
      .send({
        email: 'test@example.com',
        password: 'password'
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        userToken = `Bearer ${res.body.token}`;
        done();
      });
  });

  // Admin login
  before(function(done) {
    request(app)
      .post('/auth/local')
      .send({
        email: 'admin@example.com',
        password: 'admin'
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        adminToken = `Bearer ${res.body.token}`;
        done();
      });
  });

  describe('GET /api/adventures', function() {
    var adventures;

    beforeEach(function(done) {
      request(app)
        .get('/api/adventures')
        .set('authorization', userToken)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          adventures = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(adventures).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/adventures', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/adventures')
        .set('authorization', userToken)
        .send({
          name: 'New Adventure',
          description: 'This is the brand new adventure!!!',
          charTemplate: {
            stats: [
              {
                name: 'Lebensenergie',
                max: 40,
                current: 40,
              },
            ],
            attributes: [
              {
                name: 'Geschicklickheit',
                category: 'Grundattribute',
                code: 'GE',
                dependencies: [],
                value: 10,
                dice: 'W20',
              },
              {
                name: 'Intelligenz',
                category: 'Grundattribute',
                code: 'IN',
                dependencies: [],
                value: 10,
                dice: 'W20',
              },
              {
                name: 'Mechanik',
                category: 'Wissen',
                dependencies: ['GE', 'GE', 'IN'],
                value: 2,
              },
            ],
          }
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newAdventure = res.body;
          done();
        });
    });

    it('should respond with the newly created adventure', function() {
      expect(newAdventure.name).to.equal('New Adventure');
      expect(newAdventure._gamemaster).to.equal(user._id.toString());
      expect(newAdventure._shortId.length).to.be.at.least(7);
      expect(newAdventure.description).to.equal('This is the brand new adventure!!!');
      expect(newAdventure.charTemplate.stats.length).to.equal(1);
      expect(newAdventure.charTemplate.attributes.length).to.equal(3);
      expect(newAdventure.charTemplate.attributes[2].name).to.equal('Mechanik');
    });
  });

  describe('GET /api/adventures/my', function() {
    var adventure1;
    var adventure2;

    before(() => {
      adventure1 = new Adventure({
        name: 'TEST1',
        _gamemaster: user._id
      });

      return adventure1.save();
    });

    before(() => {
      adventure2 = new Adventure({
        name: 'TEST2',
        _gamemaster: user._id
      });

      return adventure2.save();
    });

    before(() => {
      user.adventures = [newAdventure._id, adventure1._id, adventure2._id];
      return user.save();
    });

    after(() => adventure1.remove());
    after(() => adventure2.remove());

    it('should respond with my adventures', function(done) {
      request(app)
        .get(`/api/adventures/my`)
        .set('authorization', userToken)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          expect(res.body.length).to.equal(3);
          done();
        });
    });


    it('should respond with empty array if no adventures available for that user', function(done) {
      request(app)
        .get(`/api/adventures/my`)
        .set('authorization', adminToken)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          expect(res.body.length).to.equal(0);
          done();
        });
    });
  });

  describe('GET /api/adventures/:id', function() {
    it('should respond with the requested adventure', function(done) {
      request(app)
        .get(`/api/adventures/${newAdventure._id}`)
        .set('authorization', userToken)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          var adventure = res.body;
          expect(adventure.name).to.equal('New Adventure');
          expect(adventure.description).to.equal('This is the brand new adventure!!!');
          expect(adventure.charTemplate.stats.length).to.equal(1);
          expect(adventure.charTemplate.attributes.length).to.equal(3);
          expect(adventure.charTemplate.attributes[2].name).to.equal('Mechanik');
          done();
        });
    });

    it('should respond with the requested adventure through shortId', function(done) {
      request(app)
        .get(`/api/adventures/${newAdventure._shortId}`)
        .set('authorization', userToken)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          var adventure = res.body;
          expect(adventure.name).to.equal('New Adventure');
          expect(adventure.description).to.equal('This is the brand new adventure!!!');
          expect(adventure.charTemplate.stats.length).to.equal(1);
          expect(adventure.charTemplate.attributes.length).to.equal(3);
          expect(adventure.charTemplate.attributes[2].name).to.equal('Mechanik');
          done();
        });
    });
  });

  describe('PUT /api/adventures/:id', function() {
    var updatedAdventure;

    beforeEach(function(done) {
      request(app)
        .put(`/api/adventures/${newAdventure._id}`)
        .set('authorization', userToken)
        .send({
          name: 'Updated Adventure',
          description: 'This is the updated adventure!!!',
          _gamemaster: newAdventure._gamemaster,
          _shortId: newAdventure._shortId,
          charTemplate: {
            stats: [
              {
                name: 'Lebensenergie',
                max: 40,
                current: 40,
              },
              {
                name: 'Mentale Belastbarkeit',
                max: 40,
                current: 40,
              },
            ],
            attributes: [
              {
                name: 'Geschicklickheit',
                category: 'Grundattribute',
                code: 'GE',
                dependencies: [],
                value: 10,
                dice: 'W20',
              },
              {
                name: 'Intelligenz',
                category: 'Grundattribute',
                code: 'IN',
                dependencies: [],
                value: 10,
                dice: 'W20',
              },
              {
                name: 'Botanik',
                category: 'Wissen',
                dependencies: ['GE', 'GE', 'IN'],
                value: 2,
              },
            ],
          },
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedAdventure = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedAdventure = {};
    });

    it('should respond with the updated adventure', function() {
      expect(updatedAdventure.name).to.equal('Updated Adventure');
      expect(updatedAdventure.description).to.equal('This is the updated adventure!!!');
      expect(updatedAdventure.charTemplate.stats.length).to.equal(2);
      expect(updatedAdventure.charTemplate.attributes.length).to.equal(3);
      expect(updatedAdventure.charTemplate.attributes[2].name).to.equal('Botanik');
    });

    it('should respond with the updated adventure on a subsequent GET', function(done) {
      request(app)
        .get(`/api/adventures/${newAdventure._id}`)
        .set('authorization', userToken)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let adventure = res.body;

          expect(adventure.name).to.equal('Updated Adventure');
          expect(adventure.description).to.equal('This is the updated adventure!!!');
          expect(adventure.name).to.equal('Updated Adventure');
          expect(adventure.description).to.equal('This is the updated adventure!!!');
          expect(adventure.charTemplate.stats.length).to.equal(2);
          expect(adventure.charTemplate.attributes.length).to.equal(3);
          expect(adventure.charTemplate.attributes[2].name).to.equal('Botanik');


          done();
        });
    });
  });

  describe('PATCH /api/adventures/:id', function() {
    var patchedAdventure;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/adventures/${newAdventure._id}`)
        .set('authorization', userToken)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Adventure' },
          { op: 'replace', path: '/description', value: 'This is the patched adventure!!!' },
          { op: 'replace', path: '/charTemplate/attributes/2/name', value: 'Chemie' },
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedAdventure = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedAdventure = {};
    });

    it('should respond with the patched adventure', function() {
      expect(patchedAdventure.name).to.equal('Patched Adventure');
      expect(patchedAdventure.description).to.equal('This is the patched adventure!!!');
      expect(patchedAdventure.charTemplate.stats.length).to.equal(2);
      expect(patchedAdventure.charTemplate.attributes.length).to.equal(3);
      expect(patchedAdventure.charTemplate.attributes[2].name).to.equal('Chemie');
    });
  });

  describe('DELETE /api/adventures/:id', function() {
    it('should respond with 403 when not logged in as admin', function(done) {
      request(app)
        .delete(`/api/adventures/${newAdventure._id}`)
        .set('authorization', userToken)
        .expect(403)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/adventures/${newAdventure._id}`)
        .set('authorization', adminToken)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when adventure does not exist', function(done) {
      request(app)
        .delete(`/api/adventures/${newAdventure._id}`)
        .set('authorization', adminToken)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
