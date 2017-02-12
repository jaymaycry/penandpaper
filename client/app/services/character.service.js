'use strict';

export function CharacterResource($resource) {
  'ngInject';

  return $resource('/api/characters/:id/:controller', { id: '@_id' }, {
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
