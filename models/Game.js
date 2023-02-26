const { Schema, model } = require("mongoose");

const gameSchema = new Schema({
  gameId: { type: String, required: true },
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
  finishDate: { type: Date },
  country: { type: String },
  createDate: { type: Date, default: Date.now },
});

module.exports = model("Game", gameSchema);
