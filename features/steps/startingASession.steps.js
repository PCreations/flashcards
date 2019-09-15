const { defineFeature, loadFeature } = require('jest-cucumber');
const playerSteps = require('./player');
const boxSteps = require('./box');
const { createFlashcard } = require('../../src/box');
const getPlayerBoxByName = require('../../src/box/io/getPlayerBoxByName');
const savePlayerBox = require('../../src/box/io/savePlayerBox');

const feature = loadFeature('./features/startingASession.feature');

const getIODependencies = () => {
  let currentPlayerId;
  let todayDate;
  const boxesDb = {};

  return {
    setCurrentPlayerId: playerId => {
      currentPlayerId = playerId;
    },
    getCurrentPlayerId: () => currentPlayerId,
    setTodayDate: date => {
      todayDate = date;
    },
    getTodayDate: () => todayDate,
    getPlayerBoxByName: getPlayerBoxByName.create(boxesDb),
    savePlayerBox: savePlayerBox.create(boxesDb),
  };
};

defineFeature(feature, test => {
  const deps = getIODependencies();
  test('Starting the first session for a given box', ({ given, and, when, then }) => {
    given(...playerSteps['the current player id is (.*)'](deps));

    and(...boxSteps['the current player has a box named (.*) containing flashcards:'](deps));

    and(/^the current player has never played the box (.*) before$/, async boxName => {
      const box = deps.getPlayerBoxByName({ boxName, playerId: deps.getCurrentPlayerId() });
      expect(box.startedAt).toBe(null);
    });

    and(/^today is ((?:\d{4})-(?:\d{2})-(?:\d{2}))$/, date => {
      deps.setTodayDate(date);
    });

    when(/^the current player starts a session for the box (.*)$/, boxName => {
      return startBoxSession({
        getPlayerBoxByName: deps.getPlayerBoxByName,
        playerId: getCurrentPlayerId(),
        boxName,
      });
    });

    then(
      /^the flashcards to review for the current player's box (.*) should be:$/,
      async (boxName, table) => {
        const expectedFlashcardsToReview = table.map(createFlashcard);
        const flashcardsToReview = await deps.getSessionFlashcards({
          getPlayerBoxByName,
          todayDate: deps.getTodayDate(),
          boxName,
          playerId: deps.getCurrentPlayerId(),
        });
      },
    );

    and(
      /^the current player box's (.*) should be marked as started the ((?:\d{4})-(?:\d{2})-(?:\d{2}))$/,
      async (boxName, startedDate) => {
        const box = await deps.getPlayerBoxByName({ boxName, playerId: deps.getCurrentPlayerId() });
        expect(box.startedAt).toEqual(startedDate);
      },
    );
  });
});
