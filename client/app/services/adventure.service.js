'use strict';

export function AdventureResource($resource) {
  'ngInject';

  return $resource('/api/adventures/:id/:controller', { id: '@_id' }, {
    query: {
      method: 'GET',
      isArray: true
    },
    update: {
      method: 'PUT'
    },
  });
}
