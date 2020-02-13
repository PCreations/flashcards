const express = require("express");

const createApp = () => {
  const app = express();
  app.get("/flashcards", (_, res) => {
    res.json([
      [
        {
          id: "1",
          question: "What is the first planet of our solar system ?",
          answer: "Mercury"
        },
        {
          id: "2",
          question: "What is the second planet of our solar system ?",
          answer: "Venus"
        }
      ],
      [
        {
          id: "3",
          question: "What is the third planet of our solar system ?",
          answer: "Earth"
        }
      ],
      [
        {
          id: "4",
          question: "What is the fourth planet of our solar system ?",
          answer: "Mars"
        },
        {
          id: "5",
          question: "What is the fith planet of our solar system ?",
          answer: "Jupiter"
        }
      ],
      [
        {
          id: "6",
          question: "What is the sixth planet of our solar system ?",
          answer: "Saturn"
        }
      ],
      [
        {
          id: "7",
          question: "What is the seventh planet of our solar system ?",
          answer: "Uranus"
        },
        {
          id: "8",
          question: "What is the eighth planet of our solar system ?",
          answer: "Neptune",
          partition: 5
        }
      ]
    ]);
  });
  return app;
};

module.exports = {
  createApp
};
