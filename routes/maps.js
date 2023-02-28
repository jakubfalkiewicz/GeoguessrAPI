const express = require("express");
const router = express.Router();

const Map = require("../models/Map");

// get all maps
router.get("/", async (req, res) => {
  const Maps = await Map.find({});
  return res.send(Maps);
});

// create new map
router.post("/", async (req, res) => {
  Map.create(req.body)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(400);
      res.end(error);
    });
});

router.post("/insertMany", async (req, res) => {
  const Maps = req.body;
  const createMaps = async (MapsList) => {
    MapsList.map((el) => Map.create(el));
  };
  createMaps(Maps)
    .then(res.send(Maps))
    .catch((err) => res.send(err));
});

// Pobranie danych użytkownika o podanym MapId
router.get("/:MapId", async (req, res) => {
  const id = req.params.MapId;
  const map = await Map.find({ _id: id });
  return res.send(map);
});

// Zastąpienie danych użytkownika o podanym MapId nowym „kompletem”
router.put("/:MapId", async (req, res) => {
  const id = req.params.MapId;
  const map = await Map.find({ _id: id });
  // console.log(map.locationsList[0]);
  const filter = { _id: id };
  const update = {
    name: req.body.name || map.name,
    description: req.body.description || map.description,
    locationsList: req.body.locationsList || map.locationsList,
    country: req.body.country || map.country,
  };
  // console.log(update);
  const updatedMap = await Map.updateOne(filter, update);
  return res.send({ updatedMap: updatedMap });
});

router.put("/addLocations/:MapId", async (req, res) => {
  const id = req.params.MapId;
  const map = await Map.find({ _id: id });
  const filter = { _id: id };
  const update = {
    locationsList: map[0].locationsList.concat(req.body.locationsList),
  };
  const updatedMap = await Map.updateOne(filter, update);
  return res.send({ updatedMap: updatedMap });
});

router.delete("/deleteAll", async (req, res) => {
  await Map.deleteMany({});
  return res.send("Deleted all");
});

// Usuniecie użytkownika o podanym MapId
router.delete("/:MapId", async (req, res) => {
  const id = req.params.MapId;
  const MapToDelete = await Map.findByIdAndDelete({ _id: id });
  return res.send({
    deletedMapId: id,
  });
});

module.exports = router;
