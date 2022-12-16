const { Schema, model } = require("mongoose");

const gameSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  postedBy: { type: Schema.Types.ObjectId, ref: "User" },
  likes: { type: Number, required: true },
  locationsList: [
    {
      lat: Number,
      lng: Number,
    },
  ],
  createDate: { type: Date, default: Date.now },
});

module.exports = model("Game", gameSchema);
