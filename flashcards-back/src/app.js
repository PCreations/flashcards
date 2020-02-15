const express = require("express");
const PartitionsStore = require("./infrastructure/partitions-store");

const createApp = ({
  partitionsStore = PartitionsStore.createInMemory({})
} = {}) => {
  const app = express();

  app.use(express.json());

  app.get("/flashcards", async (req, res) => {
    const { boxId } = req.query;
    try {
      const partitions = await partitionsStore.getAll(boxId);
      res.json(partitions);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/flashcards", async (req, res) => {
    const {
      boxId,
      flashcard: { question, answer }
    } = req.body;
    try {
      const [partition1, ...partitionsRest] = await partitionsStore.getAll(
        boxId
      );
      await partitionsStore.save({
        boxId,
        partitionsData: [
          [
            ...partition1,
            {
              id: "9",
              question,
              answer
            }
          ],
          ...partitionsRest
        ]
      });
      res.sendStatus(200);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return app;
};

module.exports = {
  createApp
};
