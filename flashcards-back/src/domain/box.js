const createBox = ({ id, partitions = [[], [], [], [], []] } = {}) => ({
  id,
  partitions,
  addFlashcard({ id: flashcardId, question, answer }) {
    const [partition1, ...partitionsRest] = partitions;
    return createBox({
      id,
      partitions: [
        partition1.concat({
          id: flashcardId,
          question,
          answer
        }),
        ...partitionsRest
      ]
    });
  }
});

module.exports = {
  createBox
};
