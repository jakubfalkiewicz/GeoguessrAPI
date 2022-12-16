const express = require("express");
const router = express.Router();

const User = require("../models/User");

// get all
router.get("/", async (req, res) => {
  const users = await User.find({});
  return res.send(users);
});

// register
router.post("/register", async (req, res) => {
  User.create(req.body)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(400);
      res.end(error);
    });
});

router.post("/insertMany", async (req, res) => {
  const users = req.body;
  const createUsers = async (usersList) => {
    usersList.map((el) => User.create(el));
  };
  createUsers(users)
    .then(res.send(users))
    .catch((err) => res.send(err));
});

//Login
router.post("/login", async (request, response) => {
  try {
    const user = await User.findOne({ login: request.body.login }).exec();
    if (!user) {
      return response.status(400).send({ message: "The login does not exist" });
    }
    user.comparePassword(request.body.password, (error, match) => {
      if (!match) {
        return response
          .status(400)
          .send({ message: "The password is invalid" });
      }
    });
    response.send({ ...user._doc, logged: true });
  } catch (error) {
    response.status(500).send(error);
  }
});

router.get("/:userId", async (req, res) => {
  const id = req.params.userId;
  const user = await User.find({ _id: id });
  return res.send(user);
});

router.put("/:userId", async (req, res) => {
  const id = req.params.userId;
  const user = User.find({ _id: id });
  const filter = { _id: id };
  const update = {
    login: req.body.login || user.login,
    email: req.body.email || user.email,
    admin: req.body.admin || user.admin,
  };
  const updatedUser = await User.findByIdAndUpdate(filter, update);
  return res.send({ updatedUser: updatedUser });
});
router.delete("/deleteAll", async (req, res) => {
  await User.deleteMany({});
  return res.send("Deleted all");
});

// Usuniecie użytkownika o podanym userId
router.delete("/:userId", async (req, res) => {
  const id = req.params.userId;
  const userToDelete = await User.findByIdAndDelete({ _id: id });
  return res.send({
    deletedUserId: id,
  });
});

// „Unacześnienie” wybranych danych użytkownika o podanym userId
router.patch("/:userId", async (req, res) => {
  const id = req.params.userId;
  return res.send({
    patchUserId: id,
  });
});

module.exports = router;
