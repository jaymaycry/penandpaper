'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var fileCtrlStub = {
  show: 'fileCtrl.show',
  create: 'fileCtrl.create',
  destroy: 'fileCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

var multerStub = () => ({
  single(name) {
    return `upload.single(${name})`;
  }
});

var authServiceStub = {
  isAuthenticated() {
    return 'authService.isAuthenticated';
  },
  hasRole(role) {
    return `authService.hasRole.${role}`;
  }
};

// require the index with our stubbed out modules
var fileIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './file.controller': fileCtrlStub,
  '../../auth/auth.service': authServiceStub,
  'multer': multerStub,
  'gridfs-stream': function() {},
  'multer-gridfs-storage': function() {}
});

describe('File API Router:', function() {
  it('should return an express router instance', function() {
    expect(fileIndex).to.equal(routerStub);
  });


  describe('GET /api/files/:id', function() {
    it('should verify admin role and route to file.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'authService.isAuthenticated', 'fileCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/files', function() {
    it('should route to file.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'authService.isAuthenticated', 'upload.single(file)', 'fileCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/files/:id', function() {
    it('should route to file.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'authService.hasRole.admin', 'fileCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
