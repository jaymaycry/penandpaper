'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';
import User from '../user/user.model';
import Adventure from '../adventure/adventure.model';

var newCharacter;

describe('Character API:', function() {
  var user;
  var admin;
  var userToken;
  var adminToken;
  var adventure;

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
    })
    .then(function() {
      return Adventure.remove()
      .then(function() {
        adventure = new Adventure({
          name: 'TEST ADVENTURE',
          _gamemaster: user._id
        });

        return adventure.save();
      });
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

  describe('GET /api/characters', function() {
    var characters;

    beforeEach(function(done) {
      request(app)
        .get('/api/characters')
        .set('authorization', userToken)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          characters = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(characters).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/characters', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/characters')
        .set('authorization', userToken)
        .send({
          name: 'Geronimo Röder',
          gender: 'Männlich',
          race: 'Mensch',
          profession: 'Jäger',
          age: '36',
          _adventure: adventure._id,
          attributPoints: 25,
          inventory: [
            { name: 'Knarre 3xW6 DMG', weight: 1, equipped: true },
            { name: 'Helm', weight: 1, equipped: true },
          ],
          stats: [
            { name: 'Lebensenergie', max: 40, current: 40 },
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
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newCharacter = res.body;
          done();
        });
    });

    it('should respond with the newly created character', function() {
      expect(newCharacter.name).to.equal('Geronimo Röder');
      expect(newCharacter._owner).to.equal(user._id.toString());
      expect(newCharacter.gender).to.equal('Männlich');
      expect(newCharacter.inventory.length).to.equal(2);
      expect(newCharacter.stats.length).to.equal(1);
      expect(newCharacter.attributes.length).to.equal(3);
    });
  });

  describe('GET /api/characters/my', function() {
    it('should respond with my characters', function(done) {
      request(app)
        .get('/api/characters/my')
        .set('authorization', userToken)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          var characters = res.body;
          expect(characters.length).to.equal(1);
          expect(characters[0].name).to.equal('Geronimo Röder');
          done();
        });
    });

    it('should respond with empty array if no characters created', function(done) {
      request(app)
        .get('/api/characters/my')
        .set('authorization', adminToken)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          var characters = res.body;
          expect(characters.length).to.equal(0);
          done();
        });
    });
  });

  describe('GET /api/characters/:id', function() {
    var character;

    beforeEach(function(done) {
      request(app)
        .get(`/api/characters/${newCharacter._id}`)
        .set('authorization', userToken)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          character = res.body;
          done();
        });
    });

    afterEach(function() {
      character = {};
    });

    it('should respond with the requested character', function() {
      expect(character.name).to.equal('Geronimo Röder');
      expect(character.gender).to.equal('Männlich');
      expect(character.inventory.length).to.equal(2);
      expect(character.stats.length).to.equal(1);
      expect(character.attributes.length).to.equal(3);
    });
  });

  describe('PUT /api/characters/:id', function() {
    var updatedCharacter;

    beforeEach(function(done) {
      request(app)
        .put(`/api/characters/${newCharacter._id}`)
        .set('authorization', userToken)
        .send({
          name: 'Stanley Balls',
          gender: 'Männlich',
          race: 'Mensch',
          profession: 'Jäger',
          age: '36',
          _adventure: adventure._id,
          attributPoints: 25,
          inventory: [
            { name: 'Knarre 3xW6 DMG', weight: 1, equipped: true },
            { name: 'Helm', weight: 1, equipped: true },
          ],
          stats: [
            { name: 'Lebensenergie', max: 40, current: 40 },
            { name: 'Mentale Belastbarkeit', max: 40, current: 40 },
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
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedCharacter = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedCharacter = {};
    });

    it('should respond with the updated character', function() {
      expect(updatedCharacter.name).to.equal('Stanley Balls');
      expect(updatedCharacter.gender).to.equal('Männlich');
      expect(updatedCharacter.inventory.length).to.equal(2);
      expect(updatedCharacter.stats.length).to.equal(2);
      expect(updatedCharacter.attributes.length).to.equal(3);
    });

    it('should respond with the updated character on a subsequent GET', function(done) {
      request(app)
        .get(`/api/characters/${newCharacter._id}`)
        .set('authorization', userToken)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let character = res.body;

          expect(character.name).to.equal('Stanley Balls');
          expect(character.gender).to.equal('Männlich');
          expect(character.inventory.length).to.equal(2);
          expect(character.stats.length).to.equal(2);
          expect(character.attributes.length).to.equal(3);

          done();
        });
    });
  });

  describe('PATCH /api/characters/:id', function() {
    var patchedCharacter;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/characters/${newCharacter._id}`)
        .set('authorization', userToken)
        .send([
          { op: 'replace', path: '/name', value: 'Schmorf' },
          { op: 'replace', path: '/inventory/1/name', value: 'Kevlar' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedCharacter = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedCharacter = {};
    });

    it('should respond with the patched character', function() {
      expect(patchedCharacter.name).to.equal('Schmorf');
      expect(patchedCharacter.gender).to.equal('Männlich');
      expect(patchedCharacter.inventory.length).to.equal(2);
      expect(patchedCharacter.stats.length).to.equal(2);
      expect(patchedCharacter.attributes.length).to.equal(3);
      expect(patchedCharacter.inventory[1].name).to.equal('Kevlar');
    });
  });

  describe('DELETE /api/characters/:id', function() {
    it('should respond with 403 when not logged in as admin', function(done) {
      request(app)
        .delete(`/api/characters/${newCharacter._id}`)
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
        .delete(`/api/characters/${newCharacter._id}`)
        .set('authorization', adminToken)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when character does not exist', function(done) {
      request(app)
        .delete(`/api/characters/${newCharacter._id}`)
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
