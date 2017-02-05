'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newCharacter;

describe('Character API:', function() {
  describe('GET /api/characters', function() {
    var characters;

    beforeEach(function(done) {
      request(app)
        .get('/api/characters')
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
        .send({
          name: 'Geronimo Röder',
          gender: 'Männlich',
          race: 'Mensch',
          profession: 'Jäger',
          age: '36',
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
      expect(newCharacter.gender).to.equal('Männlich');
      expect(newCharacter.inventory.length).to.equal(2);
      expect(newCharacter.stats.length).to.equal(1);
      expect(newCharacter.attributes.length).to.equal(3);
    });
  });

  describe('GET /api/characters/:id', function() {
    var character;

    beforeEach(function(done) {
      request(app)
        .get(`/api/characters/${newCharacter._id}`)
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
        .send({
          name: 'Stanley Balls',
          gender: 'Männlich',
          race: 'Mensch',
          profession: 'Jäger',
          age: '36',
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
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/characters/${newCharacter._id}`)
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
