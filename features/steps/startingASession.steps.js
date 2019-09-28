const { defineFeature, loadFeature } = require('jest-cucumber');
const playerSteps = require('./player');
const boxSteps = require('./box');
const dateSteps = require('./date');
const sessionSteps = require('./session');
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
      const box = await deps.getPlayerBoxByName({ boxName, playerId: deps.getCurrentPlayerId() });
      expect(box.startedAt).toBe(null);
    });

    and(...dateSteps['today is ((?:\\d{4})-(?:\\d{2})-(?:\\d{2}))'](deps));

    when(...sessionSteps['the current player starts a session for the box (.*)'](deps));

    then(...sessionSteps["the flashcards to review for the current player's box (.*) should be:"](deps));
  });

  test('Starting a session for an already started box', ({ given, and, when, then }) => {
    given(...playerSteps['the current player id is (.*)'](deps));

    and(...boxSteps['the current player has a box named (.*) containing flashcards:'](deps));

    and(
      ...sessionSteps[
        'the current player has completed the first session of the box (.*) the ((?:\\d{4})-(?:\\d{2})-(?:\\d{2}))'
      ](deps),
    );

    and(
      ...sessionSteps[
        'the current player has completed the last session of the box (.*) the ((?:\\d{4})-(?:\\d{2})-(?:\\d{2}))'
      ](deps),
    );

    and(...dateSteps[`today is ((?:\\d{4})-(?:\\d{2})-(?:\\d{2}))`](deps));

    when(...sessionSteps['the current player starts a session for the box (.*)'](deps));

    then(...sessionSteps["the flashcards to review for the current player's box (.*) should be:"](deps));
  });

  test('Starting a session for a given box while having missed some previous sessions', ({
    given,
    and,
    when,
    then,
  }) => {
    given(...playerSteps['the current player id is (.*)'](deps));

    and(...boxSteps['the current player has a box named (.*) containing flashcards:'](deps));

    and(
      ...sessionSteps[
        'the current player has completed the first session of the box (.*) the ((?:\\d{4})-(?:\\d{2})-(?:\\d{2}))'
      ](deps),
    );

    and(
      ...sessionSteps[
        'the current player has completed the last session of the box (.*) the ((?:\\d{4})-(?:\\d{2})-(?:\\d{2}))'
      ](deps),
    );

    and(...dateSteps['today is ((?:\\d{4})-(?:\\d{2})-(?:\\d{2}))'](deps));

    when(...sessionSteps['the current player starts a session for the box (.*)'](deps));

    then(...sessionSteps["the flashcards to review for the current player's box (.*) should be:"](deps));
  });
});
