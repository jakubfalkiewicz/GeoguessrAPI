const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3000/",
      "https://geoguessr-clone.netlify.app/",
      "https://geoguessr-clone.netlify.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const users = require("./routes/users");
app.use("/users", users);
const maps = require("./routes/maps");
app.use("/maps", maps);
const games = require("./routes/games");
app.use("/games", games);

const url = process.env.URL;

const mongoose = require("mongoose");

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((response) => {
    console.log(
      `Connected to MongoDB. Database name: "${response.connections[0].name}"`
    );
    const apiPort = process.env.PORT || 4000;
    app.listen(apiPort, () => {
      console.log(`API server available from: http://localhost:4000`);
    });
  })
  .catch((err) => console.log(err));
