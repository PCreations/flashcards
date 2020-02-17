const express = require("express");
const BoxStore = require("./infrastructure/box-store");

const createApp = ({
  boxStore = BoxStore.createInMemory(),
  middlewares = []
} = {}) => {
  const app = express();

  app.use(express.json());

  middlewares.forEach(middleware => app.use(middleware));

  app.get("/flashcards", async (req, res) => {
    const { boxId } = req.query;
    console.log("getting box of id", boxId);
    try {
      const box = await boxStore.get(boxId);
      res.json(box.partitions);
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
      const box = await boxStore.get(boxId);
      const editedBox = box.addFlashcard({
        id: boxStore.getNextFlashcardId(),
        question,
        answer
      });
      await boxStore.save(editedBox);
      res.json(editedBox.partitions);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return app;
};

module.exports = {
  createApp
};
