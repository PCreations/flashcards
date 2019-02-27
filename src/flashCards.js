const notifyAnswer = ({
  pickCurrentCard,
  removeCardFromBox = async ({ boxNumber, card }) => {},
  addCardInBox = async ({ boxNumber, card }) => {},
  correct = false,
} = {}) => async () => {
  const { card, boxNumber } = pickCurrentCard();
  if (correct) {
    await removeCardFromBox({ boxNumber, card });
    if (boxNumber < 3) await addCardInBox({ boxNumber: boxNumber + 1, card });
  } else {
    await removeCardFromBox({ boxNumber, card });
    await addCardInBox({ boxNumber: 1, card });
  }
};

const FlashCards = ({ getCardsFromBoxes, removeCardFromBox, addCardInBox }) => {
  let currentSession;
  let selectedCards;
  const pickCurrentCard = () => selectedCards.splice(0, 1)[0];
  return {
    async startSession(sessionNumber) {
      currentSession = sessionNumber;
      if (currentSession === 1 || currentSession === 2 || currentSession === 6) {
        selectedCards = await getCardsFromBoxes(1);
      } else if (currentSession === 3 || currentSession === 5) {
        selectedCards = await getCardsFromBoxes(1, 2);
      } else if (currentSession === 4) {
        selectedCards = await getCardsFromBoxes(1, 3);
      } else {
        selectedCards = await getCardsFromBoxes(1, 2, 3);
      }
    },
    notifyGoodAnswer: notifyAnswer({ correct: true, removeCardFromBox, addCardInBox, pickCurrentCard }),
    notifyWrongAnswer: notifyAnswer({ correct: false, removeCardFromBox, addCardInBox, pickCurrentCard }),
    getSelectedCards() {
      return selectedCards.map(c => c.card);
    },
  };
};

module.exports = {
  FlashCards,
};
