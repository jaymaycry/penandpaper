'use strict';

import angular from 'angular';
import SettingsController from './settings.controller';

export default angular.module('penandpaperApp.settings', [])
  .controller('SettingsController', SettingsController)
  .name;
