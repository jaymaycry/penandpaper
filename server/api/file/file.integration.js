'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newFile;

describe('File API:', function() {

  describe('POST /api/files', function() {

    it('should respond with the newly created file', function(done) {
      request(app)
        .post('/api/files')
        .attach('file', 'server/api/file/fixtures/example.jpg')
        .send({})
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newFile = res.body;
          done();
        });
    });
  });

  describe('GET /api/files/:id', function() {

    it('should respond with the requested file', function(done) {
      request(app)
        .get(`/api/files/${newFile.filename}`)
        .expect(200)
        .expect('Content-Type', 'image/jpeg')
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });

  describe('DELETE /api/files/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/files/${newFile.filename}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when file does not exist', function(done) {
      request(app)
        .delete(`/api/files/${newFile.filename}`)
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
