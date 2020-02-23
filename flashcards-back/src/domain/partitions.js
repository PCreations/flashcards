const { produce } = require("immer");

const identity = value => value;

const validatePartitionIndex = index => {
  if (index < 0 || index > 4) {
    throw new Error(
      `Partition should be comprised in between 0 and 4, received ${index}`
    );
  }
};

const createPartitions = (partitionsData = [[], [], [], [], []]) => {
  const flattenedPartitions = partitionsData
    .map((partition, partitionIndex) =>
      partition.map(flashcard => ({
        flashcard,
        fromPartition: partitionIndex
      }))
    )
    .reduce((partitions, partition) => [...partitions, ...partition], []);

  const getFlashcardByQuestion = question =>
    flattenedPartitions.find(
      ({ flashcard }) => question === flashcard.question
    );

  const getFlashcardById = id =>
    flattenedPartitions.find(({ flashcard }) => id === flashcard.id);

  return {
    addFlashcard({ partition, flashcard }) {
      validatePartitionIndex(partition);
      if (getFlashcardByQuestion(flashcard.question)) {
        throw new Error("A flashcard with this question already exists");
      }
      const newPartitionsData = produce(partitionsData, draft => {
        draft[partition].push(flashcard);
      });
      return createPartitions(newPartitionsData);
    },
    moveFlashcard({ id, toPartitionIndex }) {
      validatePartitionIndex(toPartitionIndex);
      const result = getFlashcardById(id);
      if (!result) {
        throw new Error(`Flashcard with id ${id} was not found`);
      }
      const { fromPartition } = result;
      const newPartitionsData = produce(partitionsData, draft => {
        const flashcardIndex = draft[fromPartition].findIndex(
          ({ id: flashcardId }) => id === flashcardId
        );
        const [flashcard] = draft[fromPartition].splice(flashcardIndex, 1);
        draft[toPartitionIndex].push(flashcard);
        return draft;
      });
      return createPartitions(newPartitionsData);
    },
    moveFlashcardToItsNextPartition({ id }) {
      const { fromPartition } = getFlashcardById(id);
      return this.moveFlashcard({ id, toPartitionIndex: fromPartition + 1 });
    },
    toArray() {
      return produce(partitionsData, identity);
    }
  };
};

module.exports = {
  createPartitions
};
