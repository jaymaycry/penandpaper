'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newAdventure;

describe('Adventure API:', function() {
  describe('GET /api/adventures', function() {
    var adventures;

    beforeEach(function(done) {
      request(app)
        .get('/api/adventures')
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
      expect(newAdventure.description).to.equal('This is the brand new adventure!!!');
      expect(newAdventure.charTemplate.stats.length).to.equal(1);
      expect(newAdventure.charTemplate.attributes.length).to.equal(3);
      expect(newAdventure.charTemplate.attributes[2].name).to.equal('Mechanik');
    });
  });

  describe('GET /api/adventures/:id', function() {
    var adventure;

    beforeEach(function(done) {
      request(app)
        .get(`/api/adventures/${newAdventure._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          adventure = res.body;
          done();
        });
    });

    afterEach(function() {
      adventure = {};
    });

    it('should respond with the requested adventure', function() {
      expect(adventure.name).to.equal('New Adventure');
      expect(adventure.description).to.equal('This is the brand new adventure!!!');
      expect(adventure.charTemplate.stats.length).to.equal(1);
      expect(adventure.charTemplate.attributes.length).to.equal(3);
      expect(adventure.charTemplate.attributes[2].name).to.equal('Mechanik');
    });
  });

  describe('PUT /api/adventures/:id', function() {
    var updatedAdventure;

    beforeEach(function(done) {
      request(app)
        .put(`/api/adventures/${newAdventure._id}`)
        .send({
          name: 'Updated Adventure',
          description: 'This is the updated adventure!!!',
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
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/adventures/${newAdventure._id}`)
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
