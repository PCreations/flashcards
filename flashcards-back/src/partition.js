const createPartition = flashcards => {
  return Object.freeze({
    flashcards,
    addFlashcard(flashcard) {
      return createPartition(flashcards.concat(flashcard));
    }
  });
};

module.exports = {
  createPartition
};
