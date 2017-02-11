'use strict';

export function FileResource($resource) {
  'ngInject';
  return $resource('/api/characters/:id', { id: '@_id' });
}
