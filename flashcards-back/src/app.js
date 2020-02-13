const express = require("express");
const PartitionsStore = require("./infrastructure/partitions-store");

const createApp = ({
  partitionsStore = PartitionsStore.createInMemory({})
} = {}) => {
  const app = express();
  app.get("/flashcards", async (req, res) => {
    const { boxId } = req.query;
    try {
      const partitions = await partitionsStore.getAll(boxId);
      res.json(partitions);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  return app;
};

module.exports = {
  createApp
};
