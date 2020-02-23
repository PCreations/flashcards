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
    try {
      const box = await boxStore.get(boxId);
      box; //?
      res.json({
        partitions: box.partitions,
        archivedFlashcards: box.archivedFlashcards
      });
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

  app.get("/session-flashcards", async (req, res) => {
    const { boxId } = req.query;
    try {
      const box = await boxStore.get(boxId);
      res.json(box.sessionFlashcards);
    } catch (err) {
      err.message; //?
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/submit-answer", async (req, res) => {
    const { boxId, flashcardId, right } = req.query;
    try {
      const box = await boxStore.get(boxId);
      const editedBox = box.submitAnswer({
        flashcardId,
        isAnswerRight: parseInt(right, 10) === 1
      });
      await boxStore.save(editedBox);
      res.json({ score: editedBox.sessionScore });
    } catch (err) {
      err.message.res //?
        .status(500)
        .json({ error: err.message });
    }
  });

  return app;
};

module.exports = {
  createApp
};
