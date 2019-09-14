const { createBox, addFlashcard } = require('../box');

const addFlashcardInPlayerBox = ({ getPlayerBoxByName, savePlayerBox, playerId, boxName, flashcard }) =>
  getPlayerBoxByName({ boxName, playerId })
    .catch(_ => createBox({ name: boxName }))
    .then(box => addFlashcard({ box, flashcard }))
    .then(box => savePlayerBox({ box, playerId }));

module.exports = {
  addFlashcardInPlayerBox,
};
