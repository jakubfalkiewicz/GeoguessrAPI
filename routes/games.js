const express = require("express");
const router = express.Router();

const Game = require("../models/Game");

// get all Games
router.get("/", async (req, res) => {
  const Games = await Game.find({});
  return res.send(Games);
});

// create new Game
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

// Pobranie danych użytkownika o podanym GameId
router.get("/:GameId", async (req, res) => {
  const id = req.params.GameId;
  const game = await Game.find({ _id: id });
  return res.send(game);
});

// Zastąpienie danych użytkownika o podanym GameId nowym „kompletem”
router.put("/:GameId", async (req, res) => {
  const id = req.params.GameId;
  const game = await Game.find({ _id: id });
  // console.log(map.locationsList[0]);
  const filter = { _id: id };
  const update = {
    currentRound: req.body.currentRound || game.currentRound,
    roundsList: req.body.roundsList || game.roundsList,
    timesList: req.body.timesList || game.timesList,
    finishDate: req.body.finishDate || game.finishDate,
  };
  // console.log(update);
  const updatedGame = await Game.updateOne(filter, update);
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

router.patch("/gameRound/:gameId", async (req, res) => {
  try {
    const id = req.params.gameId;
    const round = req.body.round;
    console.log(round);

    const game = await Game.find({ _id: id });
    game[0].roundsList.push(round);
    game[0].currentRound++;
    const addRound = await Game.updateOne(
      { _id: id },
      { roundsList: game[0].roundsList, currentRound: game[0].currentRound }
    );
    return res.send(game[0]);
  } catch (err) {
    res.send({ error: err });
  }
});

module.exports = router;
