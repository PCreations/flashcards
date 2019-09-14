const { defineFeature, loadFeature } = require('jest-cucumber');
const { createFlashcard } = require('../../src/createFlashcard');
const getPlayerBoxByName = require('../../src/box/io/getPlayerBoxByName');
const savePlayerBox = require('../../src/box/io/savePlayerBox');

const feature = loadFeature('./features/addingAFlashcard.feature');

defineFeature(feature, test => {
  let currentPlayerId;
  const boxesDb = {};
  const IO = {
    getPlayerBoxByName: getPlayerBoxByName.create(boxesDb),
    savePlayerBox: savePlayerBox.create(boxesDb),
  };
  test('Adding a flashcard in a new box', ({ given, and, when, then }) => {
    given(/^the current player id is (.*)$/, playerId => {
      currentPlayerId = playerId;
    });
    and(/^the current player has no box named (.*)$/, boxName => {
      return expect(IO.getPlayerBoxByName({ playerId: currentPlayerId, boxName })).rejects.toThrowError(
        'box not found',
      );
    });

    when(/^the current player wants to add a flashcard in the box (.*):$/, (boxName, table) => {
      const theFlashcardToAdd = createFlashcard({
        question: table[0].question,
        answer: table[0].answer,
      });
      return addFlashcardInPlayerBox({
        playerId: currentPlayerId,
        boxName,
        flashcard: theFlashcardToAdd,
      });
    });

    then(
      /^the current player's box (.*) should contain in its first partition the flashcard:$/,
      async (boxName, table) => {
        const box = await IO.getPlayerBoxByName({
          playerId: currentPlayerId,
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
