const createBox = ({
  id,
  partitions = [[], [], [], [], []],
  sessionDay = 1
} = {}) => {
  const box = {
    id,
    partitions,
    sessionDay,
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
        ],
        sessionDay
      });
    }
  };
  return box;
};

module.exports = {
  createBox
};
