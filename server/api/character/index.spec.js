'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var characterCtrlStub = {
  index: 'characterCtrl.index',
  show: 'characterCtrl.show',
  create: 'characterCtrl.create',
  upsert: 'characterCtrl.upsert',
  patch: 'characterCtrl.patch',
  destroy: 'characterCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var characterIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './character.controller': characterCtrlStub
});

describe('Character API Router:', function() {
  it('should return an express router instance', function() {
    expect(characterIndex).to.equal(routerStub);
  });

  describe('GET /api/characters', function() {
    it('should route to character.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'characterCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/characters/:id', function() {
    it('should route to character.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'characterCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/characters', function() {
    it('should route to character.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'characterCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/characters/:id', function() {
    it('should route to character.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'characterCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/characters/:id', function() {
    it('should route to character.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'characterCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/characters/:id', function() {
    it('should route to character.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'characterCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
