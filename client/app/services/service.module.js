'use strict';

import angular from 'angular';

import {
  AdventureResource
} from './adventure.service';
import {
  CharacterResource
} from './character.service';
import {
  FileResource
} from './file.service';

export default angular.module('penandpaperApp.service', [])
  .factory('Adventure', AdventureResource)
  .factory('Character', CharacterResource)
  .factory('File', FileResource)
  .name;
