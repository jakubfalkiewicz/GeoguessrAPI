const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const dayjs = require("dayjs");

const User = require("../models/User");

// get all
router.get("/", async (_req, res) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (error) {
    return res.status(500).send(error);
  }
});

function extractUserNameFromEmail(email) {
  const userName = email.substring(0, email.indexOf("@")); // Get the username before the @ sign
  const sanitizedUserName = userName.replace(/[\.\_\-\+]/g, " "); // Replace special characters with spaces
  return sanitizedUserName;
}

// register
router.post("/register", async (req, res) => {
  try {
    const username = extractUserNameFromEmail(req.body.email);
    const user = await User.create({ ...req.body, username: username });
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/insertMany", async (req, res) => {
  try {
    const users = req.body;
    const createUsers = async (usersList) => {
      usersList.map((el) => User.create(el));
    };
    await createUsers(users);
    return res.send(users);
  } catch (error) {
    return res.status(400).send(error);
  }
});

//Login
router.post("/login", async (request, response) => {
  console.log(request.body);
  try {
    const user = await User.findOne({ email: request.body.email }).exec();
    if (!user) {
      return response.status(400).send({ message: "The email does not exist" });
    }
    user.comparePassword(request.body.password, (error, match) => {
      if (!match) {
        return response
          .status(400)
          .send({ message: "The password is invalid" });
      }
      const token = jwt.sign({ id: user._id, email: user.email }, "secret-key");

      response.cookie("token", token, {
        httpOnly: true,
        expires: dayjs().add(7, "days").toDate(),
      });
      user.password = undefined;
      response.send({ message: "Logged in successfully", user: user });
    });
  } catch (error) {
    response.status(500).send(error);
  }
});

router.post("/logout", async (request, response) => {
  try {
    const user = await User.findOne({ email: request.body.email }).exec();
    if (!user) {
      return response.status(400).send({ message: "The email does not exist" });
    }

    response.clearCookie("token");
    response.json({ message: "Logged out successfully" });
  } catch (error) {
    response.status(500).send(error);
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const id = req.params.userId;
    const user = await User.find({ _id: id });
    return res.send(user);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.put("/:userId", async (req, res) => {
  try {
    const id = req.params.userId;
    const user = User.find({ _id: id });
    const filter = { _id: id };
    const update = {
      username: req.body.username || user.username,
      email: req.body.email || user.email,
      admin: req.body.admin || user.admin,
      experience: req.body.experience || user.experience,
    };
    const updatedUser = await User.findByIdAndUpdate(filter, update);
    res.send({ updatedUser: updatedUser });
  } catch (err) {
    res.send({ error: err.message });
  }
});
router.delete("/deleteAll", async (_req, res) => {
  try {
    await User.deleteMany({});
    return res.send("Deleted all");
  } catch (error) {
    return res.status(500).send(error);
  }
});

// Usuniecie użytkownika o podanym userId
router.delete("/:userId", async (req, res) => {
  try {
    const id = req.params.userId;
    await User.findByIdAndDelete({ _id: id });
    return res.send({
      deletedUserId: id,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
