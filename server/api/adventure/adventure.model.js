'use strict';

import mongoose from 'mongoose';
const ObjectId = mongoose.Schema.Types.ObjectId;
const diceTypes = ['W4', 'W6', 'W8', 'W10', 'W12', 'W20'];

var AdventureSchema = new mongoose.Schema({
  active: { type: Boolean, default: true },
  name: { type: String, required: true },
  description: String,
  _gamemaster: { type: ObjectId, ref: 'User', required: true },
  adventurePic: String,
  adventureHeaderPic: String,
  charTemplate: {
    /**
     * Stats are attributes of a character which will be changed by the gm
     * over time like for example health or mana, initiative etc.
     */
    stats: [{
      name: String,
      max: Number,
      current: Number,
    }],
    /**
     * Attributes are grouped by certain category like Main-Attributes, Science,
     * Weapons, Social etc.
     *
     * Attributes can depend on each other. "Main-Attributes" are used to show
     * what value the player has to roll.
     */
    attributes: [{
      name: String,
      category: String,
      code: String,
      dependencies: [String],
      value: { type: Number, default: 0 },
      dices: { type: String, enum: diceTypes },
      levelfactor: { type: Number, default: 1 },
    }],
  },

});

export default mongoose.model('Adventure', AdventureSchema);
