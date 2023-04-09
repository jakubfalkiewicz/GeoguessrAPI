const express = require("express");
const router = express.Router();

const Map = require("../models/Map");

// get all maps
router.get("/", async (_req, res) => {
  try {
    const Maps = await Map.find({});
    return res.send(Maps);
  } catch (err) {
    res.send({ error: err });
  }
});

// create new map
router.post("/", async (req, res) => {
  try {
    const result = await Map.create(req.body);
    res.send(result);
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

router.post("/insertMany", async (req, res) => {
  try {
    const Maps = req.body;
    const createMaps = async (MapsList) => {
      MapsList.map((el) => Map.create(el));
    };
    await createMaps(Maps);
    res.send(Maps);
  } catch (err) {
    res.send({ error: err });
  }
});

// Pobranie danych użytkownika o podanym MapId
router.get("/:MapId", async (req, res) => {
  try {
    const id = req.params.MapId;
    const map = await Map.find({ _id: id });
    return res.send(map);
  } catch (err) {
    res.send({ error: err });
  }
});

// Zastąpienie danych użytkownika o podanym MapId nowym „kompletem”
router.put("/:MapId", async (req, res) => {
  try {
    const id = req.params.MapId;
    const map = await Map.find({ _id: id });
    // console.log(map.locationsList[0]);
    const filter = { _id: id };
    const update = {
      name: req.body.name || map.name,
      description: req.body.description || map.description,
      locationsList: req.body.locationsList || map.locationsList,
      country: req.body.country || map.country,
      zoomLevel: req.body.zoomLevel || map.zoomLevel,
      exponent: req.body.exponent || map.exponent,
    };
    // console.log(update);
    const updatedMap = await Map.updateOne(filter, update);
    return res.send({ updatedMap: updatedMap });
  } catch (err) {
    res.send({ error: err });
  }
});

router.put("/addLocations/:MapId", async (req, res) => {
  try {
    const id = req.params.MapId;
    const map = await Map.find({ _id: id });
    const filter = { _id: id };
    const update = {
      locationsList: map[0].locationsList.concat(req.body.locationsList),
    };
    const updatedMap = await Map.updateOne(filter, update);
    return res.send({ updatedMap: updatedMap });
  } catch (err) {
    res.send({ error: err });
  }
});

router.delete("/deleteAll", async (_req, res) => {
  try {
    await Map.deleteMany({});
    return res.send("Deleted all");
  } catch (err) {
    res.send({ error: err });
  }
});

// Usuniecie użytkownika o podanym MapId
router.delete("/:MapId", async (req, res) => {
  try {
    const id = req.params.MapId;
    await Map.findByIdAndDelete({ _id: id });
    return res.send({
      deletedMapId: id,
    });
  } catch (err) {
    res.send({ error: err });
  }
});

module.exports = router;
