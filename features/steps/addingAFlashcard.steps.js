const { defineFeature, loadFeature } = require('jest-cucumber');
const playerSteps = require('./player');
const boxSteps = require('./box');
const { createFlashcard } = require('../../src/createFlashcard');
const { createBox } = require('../../src/box');
const getPlayerBoxByName = require('../../src/box/io/getPlayerBoxByName');
const savePlayerBox = require('../../src/box/io/savePlayerBox');

const feature = loadFeature('./features/addingAFlashcard.feature');

const getIODependencies = () => {
  let currentPlayerId;
  const boxesDb = {};

  return {
    setCurrentPlayerId: playerId => {
      currentPlayerId = playerId;
    },
    getCurrentPlayerId: () => currentPlayerId,
    getPlayerBoxByName: getPlayerBoxByName.create(boxesDb),
    savePlayerBox: savePlayerBox.create(boxesDb),
  };
};

defineFeature(feature, test => {
  test('Adding a flashcard in a new box', ({ given, and, when, then }) => {
    const deps = getIODependencies();
    given(...playerSteps['the current player id is (.*)'](deps));
    and(/^the current player has no box named (.*)$/, boxName => {
      return expect(
        deps.getPlayerBoxByName({ playerId: deps.getCurrentPlayerId(), boxName }),
      ).rejects.toThrowError('box not found');
    });

    when(...boxSteps['the current player wants to add a flashcard in the box (.*):'](deps));

    then(
      ...boxSteps["the current player's box (.*) should contain in its first partition the flashcards:"](
        deps,
      ),
    );
  });

  test('Adding a flashcard in an already existing box with a not empty first partition', ({
    given,
    and,
    when,
    then,
  }) => {
    const deps = getIODependencies();
    given(...playerSteps['the current player id is (.*)'](deps));
    and(/the current player has box named (.*) containing flashcards:$/, (boxName, table) => {
      const partitions = [[], [], [], [], []];
      table.forEach(
        ({ partition, question, answer }) =>
          (partitions[parseInt(partition, 10) - 1] = partitions[parseInt(partition, 10) - 1].concat(
            createFlashcard({ answer, question }),
          )),
      );
      const box = createBox({ name: boxName, partitions });
      return deps.savePlayerBox({ playerId: deps.getCurrentPlayerId(), box });
    });
    when(...boxSteps['the current player wants to add a flashcard in the box (.*):'](deps));
    then(
      ...boxSteps["the current player's box (.*) should contain in its first partition the flashcards:"](
        deps,
      ),
    );
  });

  test('Adding a flashcard with the same question than an other flashcard already in the box', ({
    given,
    and,
    when,
    then,
  }) => {
    let addFlashcardInPlayerBoxError;
    const deps = getIODependencies();
    given(...playerSteps['the current player id is (.*)'](deps));
    and(/the current player has box named (.*) containing flashcards:$/, async (boxName, table) => {
      const partitions = [[], [], [], [], []];
      table.forEach(
        ({ partition, question, answer }) =>
          (partitions[parseInt(partition, 10) - 1] = partitions[parseInt(partition, 10) - 1].concat(
            createFlashcard({ answer, question }),
          )),
      );
      const box = createBox({ name: boxName, partitions });
      return deps.savePlayerBox({ playerId: deps.getCurrentPlayerId(), box });
    });
    when(
      ...boxSteps['the current player wants to add a flashcard in the box (.*):']({
        ...deps,
        setAddFlashcardInPlayerBoxError: err => {
          addFlashcardInPlayerBoxError = err;
        },
      }),
    );
    then(
      ...boxSteps["the current player's box (.*) should contain in its first partition the flashcards:"](
        deps,
      ),
    );
    and('an error should be returned to inform the player this flashcard is already in the box', () => {
      expect(addFlashcardInPlayerBoxError.message).toMatch('flashcard already in the box');
    });
  });
});
