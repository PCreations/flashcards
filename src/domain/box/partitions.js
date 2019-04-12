const { Flashcard } = require('./flashcard');

/**
 *
 * @param {Object} params
 * @param {[Flashcard]} params.flashcards
 */
const Partition = ({ flashcards = [] } = {}) =>
  Object.freeze({
    /**
     *
     * @param {[Flashcard]} theFlashcards
     */
    ofFlashcards(theFlashcards = []) {
      return Partition({ flashcards: theFlashcards });
    },
    add(flashcard = Flashcard) {
      return Partition({ flashcards: [...flashcards, flashcard] });
    },
    flashcards,
  });

module.exports = {
  Partition: Partition(),
};
