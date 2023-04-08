const { Schema, model } = require("mongoose");

const mapSchema = new Schema({
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
  zoomLevel: Number,
  country: { type: String, required: false },
  createDate: { type: Date, default: Date.now },
});

module.exports = model("Map", mapSchema);
