const express = require("express");
const router = express.Router();

const Game = require("../models/Game");

// get all games
router.get("/", async (req, res) => {
  const Games = await Game.find({});
  res.header("Access-Control-Allow-Origin", "*");
  return res.send(Games);
});

// create new game
router.post("/", async (req, res) => {
  Game.create(req.body)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(400);
      res.end(error);
    });
});

router.post("/insertMany", async (req, res) => {
  const Games = req.body;
  const createGames = async (GamesList) => {
    GamesList.map((el) => Game.create(el));
  };
  createGames(Games)
    .then(res.send(Games))
    .catch((err) => res.send(err));
});

// Pobranie danych użytkownika o podanym GameId
router.get("/:GameId", async (req, res) => {
  const id = req.params.GameId;
  const game = await Game.find({ _id: id });
  res.header("Access-Control-Allow-Origin", "*");
  return res.send(game);
});

// Zastąpienie danych użytkownika o podanym GameId nowym „kompletem”
router.put("/:GameId", async (req, res) => {
  const id = req.params.GameId;
  const game = Game.find({ _id: id });
  const filter = { _id: id };
  const update = {
    name: req.body.name || game.name,
    description: req.body.description || game.description,
    locationsList: req.body.locationsList || game.locationsList,
  };
  const updatedGame = await Game.findByIdAndUpdate(filter, update);
  return res.send({ updatedGame: updatedGame });
});
router.delete("/deleteAll", async (req, res) => {
  await Game.deleteMany({});
  return res.send("Deleted all");
});

// Usuniecie użytkownika o podanym GameId
router.delete("/:GameId", async (req, res) => {
  const id = req.params.GameId;
  const GameToDelete = await Game.findByIdAndDelete({ _id: id });
  return res.send({
    deletedGameId: id,
  });
});

// „Unacześnienie” wybranych danych użytkownika o podanym GameId
router.patch("/:GameId", async (req, res) => {
  const id = req.params.GameId;
  return res.send({
    patchGameId: id,
  });
});

module.exports = router;
