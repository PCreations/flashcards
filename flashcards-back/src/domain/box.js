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
  partitions: partitionsData = [[], [], [], [], [], []],
  sessionDay = 1,
  sessionScore = 0
} = {}) => {
  const data = {
    id,
    partitions: createPartitions(partitionsData),
    sessionDay,
    sessionScore
  };

  const sessionFlashcards = getSessionFlashcardsFor(
    sessionDay,
    data.partitions.toArray()
  );

  const submitRightAnswer = ({ flashcardId } = {}) =>
    createBox({
      ...data,
      partitions: data.partitions
        .moveFlashcardToItsNextPartition({ id: flashcardId })
        .toArray(),
      sessionScore: data.sessionScore + 1
    });

  const submitWrongAnswer = ({ flashcardId } = {}) =>
    createBox({
      ...data,
      partitions: data.partitions
        .moveFlashcard({ id: flashcardId, toPartitionIndex: 0 })
        .toArray()
    });

  const partitionsAsArray = data.partitions.toArray();
  return {
    ...data,
    partitions: partitionsAsArray.slice(0, 5),
    archivedFlashcards: partitionsAsArray[partitionsAsArray.length - 1],
    sessionFlashcards,
    addFlashcard({ id: flashcardId, question, answer }) {
      return createBox({
        ...data,
        partitions: data.partitions
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
};

module.exports = {
  createBox
};
