const { defineFeature, loadFeature } = require('jest-cucumber');
const { createFlashcard } = require('../../src/createFlashcard');
const { createBox, addFlashcard } = require('../../src/box');
const getPlayerBoxByName = require('../../src/box/io/getPlayerBoxByName');
const savePlayerBox = require('../../src/box/io/savePlayerBox');
const { addFlashcardInPlayerBox } = require('../../src/useCases/addFlashcardInPlayerBox');

const feature = loadFeature('./features/addingAFlashcard.feature');

defineFeature(feature, test => {
  test('Adding a flashcard in a new box', ({ given, and, when, then }) => {
    let currentPlayerId;
    const boxesDb = {};
    const IO = {
      getPlayerBoxByName: getPlayerBoxByName.create(boxesDb),
      savePlayerBox: savePlayerBox.create(boxesDb),
    };
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
        getPlayerBoxByName: IO.getPlayerBoxByName,
        savePlayerBox: IO.savePlayerBox,
        playerId: currentPlayerId,
        boxName,
        flashcard: theFlashcardToAdd,
      });
    });

    then(
      /^the current player's box (.*) should contain in its first partition the flashcards:$/,
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

  test('Adding a flashcard in an already existing box with a not empty first partition', ({
    given,
    and,
    when,
    then,
  }) => {
    let currentPlayerId;
    const boxesDb = (() => {
      const boxes = {};
      return {
        get value() {
          return boxes;
        },
      };
    })();
    const IO = {
      getPlayerBoxByName: getPlayerBoxByName.create(boxesDb.value),
      savePlayerBox: savePlayerBox.create(boxesDb.value),
    };
    given(/^the current player id is (.*)$/, playerId => {
      currentPlayerId = playerId;
    });
    and(/the current player has box named (.*) containing flashcards:$/, (boxName, table) => {
      const partitions = [[], [], [], [], []];
      table.forEach(
        ({ partition, question, answer }) =>
          (partitions[parseInt(partition, 10) - 1] = partitions[parseInt(partition, 10) - 1].concat(
            createFlashcard({ answer, question }),
          )),
      );
      const box = createBox({ name: boxName, partitions });
      return IO.savePlayerBox({ playerId: currentPlayerId, box });
    });
    when(/^the current player wants to add a flashcard in the box (.*):$/, (boxName, table) => {
      const theFlashcardToAdd = createFlashcard({
        question: table[0].question,
        answer: table[0].answer,
      });
      return addFlashcardInPlayerBox({
        getPlayerBoxByName: IO.getPlayerBoxByName,
        savePlayerBox: IO.savePlayerBox,
        playerId: currentPlayerId,
        boxName,
        flashcard: theFlashcardToAdd,
      });
    });
    then(
      /^the current player's box (.*) should contain in its first partition the flashcards:$/,
      async (boxName, table) => {
        const box = await IO.getPlayerBoxByName({
          playerId: currentPlayerId,
          boxName,
        });
        const expectedFlashcardsInFirstPartition = table.map(createFlashcard);
        expect(box.partitions[0]).toEqual(expectedFlashcardsInFirstPartition);
      },
    );
  });

  test('Adding a flashcard with the same question than an other flashcard already in the box', ({
    given,
    and,
    when,
    then,
  }) => {
    let currentPlayerId;
    let addFlashcardInPlayerBoxError;
    const boxesDb = (() => {
      const boxes = {};
      return {
        get value() {
          return boxes;
        },
      };
    })();
    const IO = {
      getPlayerBoxByName: getPlayerBoxByName.create(boxesDb.value),
      savePlayerBox: savePlayerBox.create(boxesDb.value),
    };
    given(/^the current player id is (.*)$/, playerId => {
      currentPlayerId = playerId;
    });
    and(/the current player has box named (.*) containing flashcards:$/, (boxName, table) => {
      const partitions = [[], [], [], [], []];
      table.forEach(
        ({ partition, question, answer }) =>
          (partitions[parseInt(partition, 10) - 1] = partitions[parseInt(partition, 10) - 1].concat(
            createFlashcard({ answer, question }),
          )),
      );
      const box = createBox({ name: boxName, partitions });
      return IO.savePlayerBox({ playerId: currentPlayerId, box });
    });
    when(/^the current player wants to add a flashcard in the box (.*):$/, (boxName, table) => {
      const theFlashcardToAdd = createFlashcard({
        question: table[0].question,
        answer: table[0].answer,
      });
      return addFlashcardInPlayerBox({
        getPlayerBoxByName: IO.getPlayerBoxByName,
        savePlayerBox: IO.savePlayerBox,
        playerId: currentPlayerId,
        boxName,
        flashcard: theFlashcardToAdd,
      }).catch(err => {
        addFlashcardInPlayerBoxError = err;
      });
    });
    then(
      /^the current player's box (.*) should contain in its first partition the flashcards:$/,
      async (boxName, table) => {
        const box = await IO.getPlayerBoxByName({
          playerId: currentPlayerId,
          boxName,
        });
        const expectedFlashcardsInFirstPartition = table.map(createFlashcard);
        expect(box.partitions[0]).toEqual(expectedFlashcardsInFirstPartition);
      },
    );
    and('an error should be returned to inform the player this flashcard is already in the box', () => {
      expect(addFlashcardInPlayerBoxError).toMatch('Flashcard already in the box');
    });
  });
});
