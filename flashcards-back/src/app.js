const express = require("express");
const PartitionsStore = require("./infrastructure/partitions-store");

const createApp = ({
  partitionsStore = PartitionsStore.createInMemory({})
} = {}) => {
  const app = express();
  app.get("/flashcards", async (req, res) => {
    const { boxId } = req.query;
    const partitions = await partitionsStore.getAll(boxId);
    res.json(partitions);
  });
  return app;
};

module.exports = {
  createApp
};
