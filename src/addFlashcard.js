const { createBox } = require('./createBox');

const addFlashcard = ({ box, flashcard }) =>
  createBox({
    ...box,
    partitions: [[flashcard], ...box.partitions.slice(1)],
  });

module.exports = {
  addFlashcard,
};
