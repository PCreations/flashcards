const { Box } = require('../../src/domain/box/box');
const { Flashcard } = require('../../src/domain/box/flashcard');
const { Player } = require('../../src/domain/player/player');

const createBox = ({
  boxName = String(),
  ownedByPlayerWithId = String(),
  flashcards = [{ id: String(), answer: String(), question: String() }],
} = {}) =>
  Box.named(boxName)
    .ownedBy(Player.ofId(ownedByPlayerWithId))
    .withPartition(1)
    .containing(
      flashcards.map(({ id, answer, question }) =>
        Flashcard.ofQuestion(question)
          .withAnswer(answer)
          .withId(id),
      ),
    );

const createFlashcardsFromGherkinDatatable = flashcardsDatatable =>
  flashcardsDatatable.hashes().map(({ id, answer, question }) =>
    Flashcard.ofQuestion(question)
      .withAnswer(answer)
      .withId(id),
  );

module.exports = {
  createBox,
  createFlashcardsFromGherkinDatatable,
};
