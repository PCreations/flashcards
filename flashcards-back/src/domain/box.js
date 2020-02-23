const getSessionFlashcardsFor = (sessionDay, partitions) =>
  [1, 2, 3, 4, 5]
    .map(day =>
      sessionDay % day === 0
        ? partitions[day - 1].map(flashcard => ({
            flashcard,
            fromPartition: day - 1
          }))
        : []
    )
    .reduce(
      (flattenedFlashcards, dayFlashcard) =>
        flattenedFlashcards.concat(dayFlashcard),
      []
    );

const createBox = ({
  id,
  partitions = [[], [], [], [], []],
  sessionDay = 1,
  sessionScore = 0
} = {}) => {
  const sessionFlashcards = getSessionFlashcardsFor(sessionDay, partitions);
  const box = {
    id,
    partitions,
    sessionDay,
    sessionScore,
    sessionFlashcards,
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
        sessionDay,
        sessionFlashcards
      });
    },
    submitRightAnswer() {
      return createBox({
        id,
        partitions,
        sessionDay,
        sessionScore: sessionScore + 1
      });
    }
  };
  return box;
};

module.exports = {
  createBox
};
