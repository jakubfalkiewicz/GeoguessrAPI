const express = require("express");
const router = express.Router();

const Game = require("../models/Game");

// get all Games
router.get("/", async (_req, res) => {
  try {
    const Games = await Game.find({});
    return res.send(Games);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/byUser/:userId", async (req, res) => {
  try {
    const id = req.params.userId;
    const game = await Game.find({ player: id });
    return res.send(game);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Pobranie danych użytkownika o podanym GameId
router.get("/:GameId", async (req, res) => {
  try {
    const id = req.params.GameId;
    const game = await Game.find({ gameId: id });
    return res.send(game);
  } catch (error) {
    res.status(400).send(error);
  }
});

// create new Game
router.post("/", async (req, res) => {
  try {
    const result = await Game.create(req.body);
    res.send(result);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Zastąpienie danych użytkownika o podanym GameId nowym „kompletem”
router.put("/:GameId", async (req, res) => {
  try {
    const id = req.params.GameId;
    const filter = { gameId: id };
    const update = {
      currentRound: req.body.currentRound,
      roundsList: req.body.roundsList,
      timesList: req.body.timesList,
      finishDate: req.body.finishDate,
    };
    const updatedGame = await Game.updateOne(filter, update);
    return res.send({ updatedGame: updatedGame });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/deleteAll", async (_req, res) => {
  try {
    await Game.deleteMany({});
    return res.send("Deleted all");
  } catch (error) {
    res.status(400).send(error);
  }
});

// Usuniecie użytkownika o podanym GameId
router.delete("/:GameId", async (req, res) => {
  try {
    const id = req.params.GameId;
    await Game.findByIdAndDelete({ _id: id });
    return res.send({
      deletedGameId: id,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch("/gameRound/:gameId", async (req, res) => {
  try {
    const id = req.params.gameId;
    const round = req.body.round;
    const game = await Game.find({ _id: id });
    game[0].roundsList.push(round);
    game[0].currentRound++;
    await Game.updateOne(
      { _id: id },
      { roundsList: game[0].roundsList, currentRound: game[0].currentRound }
    );
    return res.send(game[0]);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
