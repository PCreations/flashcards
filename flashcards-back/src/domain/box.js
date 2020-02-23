const { createPartitions } = require("./partitions");

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
  partitions: partitionsData = [[], [], [], [], []],
  sessionDay = 1,
  sessionScore = 0
} = {}) => {
  const partitions = createPartitions(partitionsData);
  const sessionFlashcards = getSessionFlashcardsFor(
    sessionDay,
    partitions.toArray()
  );

  const submitRightAnswer = ({ flashcardId } = {}) =>
    createBox({
      id,
      partitions: partitions
        .moveFlashcardToItsNextPartition({ id: flashcardId })
        .toArray(),
      sessionDay,
      sessionScore: sessionScore + 1
    });

  const submitWrongAnswer = ({ flashcardId } = {}) =>
    createBox({
      id,
      partitions: partitions
        .moveFlashcard({ id: flashcardId, toPartitionIndex: 0 })
        .toArray(),
      sessionDay,
      sessionScore
    });

  const box = {
    id,
    partitions: partitions.toArray(),
    sessionDay,
    sessionScore,
    sessionFlashcards,
    addFlashcard({ id: flashcardId, question, answer }) {
      return createBox({
        id,
        partitions: partitions
          .addFlashcard({
            partition: 0,
            flashcard: {
              id: flashcardId,
              question,
              answer
            }
          })
          .toArray(),
        sessionDay,
        sessionFlashcards
      });
    },
    submitAnswer({ flashcardId, isAnswerRight } = {}) {
      const box = isAnswerRight
        ? submitRightAnswer({ flashcardId })
        : submitWrongAnswer({ flashcardId });
      if (box.sessionFlashcards.length === 0) {
        return createBox({
          ...box,
          sessionDay: box.sessionDay + 1,
          sessionScore: 0
        });
      }
      return box;
    }
  };
  return box;
};

module.exports = {
  createBox
};
