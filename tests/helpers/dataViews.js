const { Flashcard } = require('../../src/domain/box/flashcard');
const { Box } = require('../../src/domain/box/box');

const flashcardsView = (flashcards = [Flashcard]) =>
  flashcards.map(({ id, answer, question }) => ({ id, answer, question }));

const flashcardsInPartitions = ({ box = Box, partitions = [String()] } = {}) => [];

module.exports = {
  flashcardsView,
  flashcardsInPartitions,
};
