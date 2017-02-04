/**
 * Adventure model events
 */

'use strict';

import {EventEmitter} from 'events';
import Adventure from './adventure.model';
var AdventureEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
AdventureEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Adventure.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    AdventureEvents.emit(event + ':' + doc._id, doc);
    AdventureEvents.emit(event, doc);
  };
}

export default AdventureEvents;
