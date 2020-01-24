const express = require("express");
const cors = require("cors");
const { getConfig } = require("../config");

const config = getConfig();
const app = express();

app.use(cors());

app.get("/", function(_, res) {
  res.send("hello world");
});

app.listen(config.PORT);
