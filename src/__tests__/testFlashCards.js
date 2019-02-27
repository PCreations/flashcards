const { FlashCards } = require('../flashCards');

const TestFlashCards = ({ boxes }) =>
  FlashCards({
    boxes,
    getCardsFromBoxes(...boxNumbers) {
      return boxNumbers.reduce((cards, boxNumber) => [...cards, ...boxes[boxNumber - 1]], []);
    },
  });

module.exports = {
  TestFlashCards,
};
