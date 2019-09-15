const { createBox } = require('./createBox');

const addFlashcard = ({ box, flashcard }) =>
  createBox({
    ...box,
    partitions: [box.partitions[0].concat(flashcard), ...box.partitions.slice(1)],
  });

module.exports = {
  addFlashcard,
};
