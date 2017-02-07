'use strict';

/* globals sinon, describe, expect, it */

// var proxyquire = require('proxyquire').noPreserveCache();

// var fileCtrlStub = {
//   index: 'fileCtrl.index',
//   show: 'fileCtrl.show',
//   create: 'fileCtrl.create',
//   upsert: 'fileCtrl.upsert',
//   patch: 'fileCtrl.patch',
//   destroy: 'fileCtrl.destroy'
// };

// var routerStub = {
//   get: sinon.spy(),
//   put: sinon.spy(),
//   patch: sinon.spy(),
//   post: sinon.spy(),
//   delete: sinon.spy()
// };

// // require the index with our stubbed out modules
// var fileIndex = proxyquire('./index.js', {
//   express: {
//     Router() {
//       return routerStub;
//     }
//   },
//   './file.controller': fileCtrlStub
// });

// describe('File API Router:', function() {
//   it('should return an express router instance', function() {
//     expect(fileIndex).to.equal(routerStub);
//   });


//   describe('GET /api/files/:id', function() {
//     it('should route to file.controller.show', function() {
//       expect(routerStub.get
//         .withArgs('/:id', 'fileCtrl.show')
//         ).to.have.been.calledOnce;
//     });
//   });

//   describe('POST /api/files', function() {
//     it('should route to file.controller.create', function() {
//       expect(routerStub.post
//         .withArgs('/', 'fileCtrl.create')
//         ).to.have.been.calledOnce;
//     });
//   });

//   describe('DELETE /api/files/:id', function() {
//     it('should route to file.controller.destroy', function() {
//       expect(routerStub.delete
//         .withArgs('/:id', 'fileCtrl.destroy')
//         ).to.have.been.calledOnce;
//     });
//   });
// });
