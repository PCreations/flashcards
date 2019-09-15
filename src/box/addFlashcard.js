const { createBox } = require('./createBox');

const isFlashcardWithThisQuestionAlreadyExists = ({ box, flashcard }) =>
  Boolean(
    ~box.partitions.findIndex(partition =>
      Boolean(~partition.findIndex(({ question }) => question === flashcard.question)),
    ),
  );

const addFlashcard = ({ box, flashcard }) => {
  if (isFlashcardWithThisQuestionAlreadyExists({ box, flashcard })) {
    throw new Error('flashcard already in the box');
  } else {
    return createBox({
      ...box,
      partitions: [box.partitions[0].concat(flashcard), ...box.partitions.slice(1)],
    });
  }
};

module.exports = {
  addFlashcard,
};
