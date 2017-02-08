'use strict';

export function CharacterResource($resource) {
  'ngInject';

  return $resource('/api/characters/:id/:controller', { id: '@_id' }, {
    query: {
      method: 'GET',
      isArray: true
    },
    update: {
      method: 'PUT'
    },
  });
}
