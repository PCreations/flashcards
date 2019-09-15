const { createStep } = require('../createStep');
const { createFlashcard } = require('../../../src/createFlashcard');
const { addFlashcardInPlayerBox } = require('../../../src/useCases/addFlashcardInPlayerBox');

module.exports = {
  ...createStep(
    "the current player's box (.*) should contain in its first partition the flashcards:",
    ({ getCurrentPlayerId, getPlayerBoxByName }) => async (boxName, table) => {
      const box = await getPlayerBoxByName({
        playerId: getCurrentPlayerId(),
        boxName,
      });
      const theExpectedFlashcard = createFlashcard({
        question: table[0].question,
        answer: table[0].answer,
      });

      expect(box.partitions[0]).toContainEqual(theExpectedFlashcard);
    },
  ),
  ...createStep(
    'the current player wants to add a flashcard in the box (.*):',
    ({ getCurrentPlayerId, setAddFlashcardInPlayerBoxError, getPlayerBoxByName, savePlayerBox }) => (
      boxName,
      table,
    ) => {
      const theFlashcardToAdd = createFlashcard({
        question: table[0].question,
        answer: table[0].answer,
      });
      return addFlashcardInPlayerBox({
        getPlayerBoxByName,
        savePlayerBox,
        playerId: getCurrentPlayerId(),
        boxName,
        flashcard: theFlashcardToAdd,
      }).catch(setAddFlashcardInPlayerBoxError);
    },
  ),
};
