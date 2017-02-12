'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import User from '../user/user.model';
import request from 'supertest';

var newFile;

describe('File API:', function() {
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


  // Clear users after testing
  after(function() {
    return User.remove();
  });

  describe('POST /api/files', function() {

    it('should respond with the newly created file', function(done) {
      console.log(userToken);
      console.log(adminToken);
      request(app)
        .post('/api/files')
        .set('authorization', userToken)
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
    it('should respond with 401 when not logged in', function(done) {
      request(app)
        .get(`/api/files/${newFile.filename}`)
        .expect(401)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with the requested file', function(done) {
      request(app)
        .get(`/api/files/${newFile.filename}`)
        .set('authorization', userToken)
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
    it('should respond with 403 without admin role on removal', function(done) {
      request(app)
        .delete(`/api/files/${newFile.filename}`)
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
        .delete(`/api/files/${newFile.filename}`)
        .set('authorization', adminToken)
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
