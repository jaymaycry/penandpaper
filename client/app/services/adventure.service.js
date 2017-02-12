'use strict';

export function AdventureResource($resource) {
  'ngInject';

  return $resource('/api/adventures/:id/:controller', { id: '@_id' }, {
    query: {
      method: 'GET',
      isArray: true
    },
    my: {
      method: 'GET',
      isArray: true,
      params: { controller: 'my' }
    },
    update: {
      method: 'PUT'
    },

  });
}
