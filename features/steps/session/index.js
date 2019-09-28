const { createStep } = require('../createStep');
const { createFlashcard } = require('../../../src/createFlashcard');
const { startBoxSession } = require('../../../src/useCases/startBoxSession');

module.exports = {
  ...createStep(
    'the current player starts a session for the box (.*)',
    ({ getPlayerBoxByName, getCurrentPlayerId }) => boxName =>
      startBoxSession({
        getPlayerBoxByName: getPlayerBoxByName,
        playerId: getCurrentPlayerId(),
        boxName,
      }),
  ),
  ...createStep(
    "the flashcards to review for the current player's box (.*) should be:",
    ({ getSessionFlashcards, getTodayDate, getCurrentPlayerId, getPlayerBoxByName }) => async (
      boxName,
      table,
    ) => {
      const expectedFlashcardsToReview = table.map(createFlashcard);
      const flashcardsToReview = await getSessionFlashcards({
        getPlayerBoxByName,
        todayDate: getTodayDate(),
        boxName,
        playerId: getCurrentPlayerId(),
      });
      expect(flashcardsToReview).toEqual(expectedFlashcardsToReview);
    },
  ),
  ...createStep(
    'the current player has completed the first session of the box (.*) the ((?:\\d{4})-(?:\\d{2})-(?:\\d{2}))',
    () => {},
  ),
  ...createStep(
    'the current player has completed the last session of the box (.*) the ((?:\\d{4})-(?:\\d{2})-(?:\\d{2}))',
    () => {},
  ),
};
