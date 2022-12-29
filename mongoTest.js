const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const express = require("express");
const app = express();
app.use(express.json());
require("dotenv").config();
const cors = require("cors");
app.use(cors());
app.options("*", cors()); // include before other routes
const users = require("./routes/users");
app.use("/users", users);
const maps = require("./routes/maps");
app.use("/maps", maps);
const games = require("./routes/games");
app.use("/games", games);

app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});
// Connection URL
const url = process.env.URL;

// Database Name
const dbName = "myproject";

// Create a new MongoClient
const client = new MongoClient(url);

const mongoose = require("mongoose");

// Łączymy się z bazą MongoDB i jeśli się to uda, uruchamiamy serwer API.
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
  });
