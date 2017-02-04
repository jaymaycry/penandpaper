'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var adventureCtrlStub = {
  index: 'adventureCtrl.index',
  show: 'adventureCtrl.show',
  create: 'adventureCtrl.create',
  upsert: 'adventureCtrl.upsert',
  patch: 'adventureCtrl.patch',
  destroy: 'adventureCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var adventureIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './adventure.controller': adventureCtrlStub
});

describe('Adventure API Router:', function() {
  it('should return an express router instance', function() {
    expect(adventureIndex).to.equal(routerStub);
  });

  describe('GET /api/adventures', function() {
    it('should route to adventure.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'adventureCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/adventures/:id', function() {
    it('should route to adventure.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'adventureCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/adventures', function() {
    it('should route to adventure.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'adventureCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/adventures/:id', function() {
    it('should route to adventure.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'adventureCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/adventures/:id', function() {
    it('should route to adventure.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'adventureCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/adventures/:id', function() {
    it('should route to adventure.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'adventureCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
