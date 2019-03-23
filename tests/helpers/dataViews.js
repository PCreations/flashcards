const { Flashcard } = require('../../src/domain/box/flashcard');

const flashcardsView = (flashcards = [Flashcard]) =>
  flashcards.map(({ id, answer, question }) => ({ id, answer, question }));

module.exports = {
  flashcardsView,
};
