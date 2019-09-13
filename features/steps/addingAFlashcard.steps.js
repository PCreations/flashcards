const { defineFeature, loadFeature } = require('jest-cucumber');
const { createFlashcard } = require('../../src/createFlashcard');
const { getCurrentPlayer } = require('../../src/getCurrentPlayer');
const { getPlayerBoxByName } = require('../../src/getPlayerBoxByName');
const { addFlashcardInPlayerBox } = require('../../src/addFlashcardInPlayerBox');

const feature = loadFeature('./features/addingAFlashcard.feature');

defineFeature(feature, test => {
  test('Adding a flashcard in a new box', ({ given, when, then }) => {
    given(/^the current player has no box named (.*)$/, boxName => {
      const currentPlayer = getCurrentPlayer();
      return expect(getPlayerBoxByName({ player: currentPlayer, boxName })).rejects.toMatch('box not found');
    });

    when(/^the current player wants to add a flashcard in the box (.*):$/, (boxName, table) => {
      const currentPlayer = getCurrentPlayer();
      const theFlashcardToAdd = createFlashcard({
        question: table[0].question,
        answer: table[0].answer,
      });
      return addFlashcardInPlayerBox({
        player: currentPlayer,
        boxName,
        flashcard: theFlashcardToAdd,
      });
    });

    then(
      /^the current player's box (.*) should contain in its first partition the flashcard:$/,
      async (boxName, table) => {
        const currentPlayer = getCurrentPlayer();
        const box = await getPlayerBoxByName({
          player: currentPlayer,
          boxName,
        });
        const theExpectedFlashcard = createFlashcard({
          question: table[0].question,
          answer: table[0].answer,
        });

        expect(box.partitions[0]).toContainEqual(theExpectedFlashcard);
      },
    );
  });
});
