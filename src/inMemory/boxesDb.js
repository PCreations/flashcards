const InMemoryBoxesDb = boxes => {
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
      data = data.filter(c => c.card !== card);
    },
    addCardInBox({ boxNumber, card }) {
      data.push({ boxNumber, card });
    },
    async getBoxes() {
      const boxes = [[], [], []];
      data.forEach(({ card, boxNumber }) => boxes[boxNumber - 1].push(card));
      return boxes;
    },
  };
};

module.exports = {
  InMemoryBoxesDb,
};
