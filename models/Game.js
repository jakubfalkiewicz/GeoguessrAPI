const { Schema, model } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const gameSchema = new Schema({
  _id: { type: String, default: uuidv4 },
  time: { type: Number, required: true },
  player: { type: Schema.Types.ObjectId, ref: "User" },
  mapId: { type: Schema.Types.ObjectId, ref: "Map" },
  move: { type: Boolean, required: true },
  pan: { type: Boolean, required: true },
  zoom: { type: Boolean, required: true },
  locations: [
    {
      lat: Number,
      lng: Number,
    },
  ],
  currentRound: { type: Number, required: true },
  roundsList: [
    {
      lat: Number,
      lng: Number,
    },
  ],
  timesList: [Number],
  createDate: { type: Date, default: Date.now },
});

module.exports = model("Game", gameSchema);
