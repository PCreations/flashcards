const { FlashCards } = require('../flashCards');

const InMemoryBoxes = boxes => {
  let data = boxes.reduce(
    (allCards, boxCards, boxIndex) => [
      ...allCards,
      ...boxCards.reduce(
        (cards, card) => [
          ...cards,
          {
            card,
            boxNumber: boxIndex + 1,
          },
        ],
        [],
      ),
    ],
    [],
  );

  return {
    getCardsFromBoxes(...boxNumbers) {
      return data.filter(card => boxNumbers.includes(card.boxNumber));
    },
    removeCardFromBox({ card }) {
      debugger;
      data = data.filter(c => c.card !== card);
      debugger;
    },
    addCardInBox({ boxNumber, card }) {
      data.push({ boxNumber, card });
      debugger;
    },
    async getBoxes() {
      const boxes = [[], [], []];
      data.forEach(({ card, boxNumber }) => boxes[boxNumber - 1].push(card));
      return boxes;
    },
  };
};

const TestFlashCards = ({ boxes }) => {
  const inMemoryBoxes = InMemoryBoxes(boxes);
  return {
    ...FlashCards(inMemoryBoxes),
    getBoxes: inMemoryBoxes.getBoxes,
  };
};

module.exports = {
  TestFlashCards,
};
