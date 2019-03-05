const notifyAnswer = async ({
  currentCard,
  removeCardFromBox = async ({ boxNumber, card }) => {},
  addCardInBox = async ({ boxNumber, card }) => {},
  correct = false,
} = {}) => {
  const { card, boxNumber } = currentCard;
  if (correct) {
    await removeCardFromBox({ boxNumber, card });
    if (boxNumber < 3) await addCardInBox({ boxNumber: boxNumber + 1, card });
  } else {
    await removeCardFromBox({ boxNumber, card });
    await addCardInBox({ boxNumber: 1, card });
  }
};

const FlashCards = ({
  getCardsFromBoxes,
  removeCardFromBox,
  addCardInBox,
  getPreviousSessionNumber,
  setPreviousSessionNumber,
}) => {
  let currentSession;
  let selectedCards;
  let currentCardIndex = 0;
  let currentCard;
  const pickCurrentCard = () => {
    currentCard = selectedCards[currentCardIndex++];
  };

  const endSessionIfNoMoreCardToPick = () => {
    return currentCardIndex === selectedCards.length
      ? setPreviousSessionNumber(currentSession)
      : Promise.resolve();
  };

  return {
    async startSession() {
      const previousSession = (await getPreviousSessionNumber()) || 0;
      currentSession = previousSession < 7 ? previousSession + 1 : 1;
      if (currentSession === 1 || currentSession === 2 || currentSession === 6) {
        selectedCards = await getCardsFromBoxes(1);
      } else if (currentSession === 3 || currentSession === 5) {
        selectedCards = await getCardsFromBoxes(1, 2);
      } else if (currentSession === 4) {
        selectedCards = await getCardsFromBoxes(1, 3);
      } else {
        selectedCards = await getCardsFromBoxes(1, 2, 3);
      }
      pickCurrentCard();
    },
    async addCard(card) {
      return addCardInBox({ boxNumber: 1, card });
    },
    notifyGoodAnswer() {
      return notifyAnswer({ correct: true, removeCardFromBox, addCardInBox, currentCard })
        .then(pickCurrentCard)
        .then(endSessionIfNoMoreCardToPick);
    },
    notifyWrongAnswer() {
      return notifyAnswer({ correct: false, removeCardFromBox, addCardInBox, currentCard })
        .then(pickCurrentCard)
        .then(endSessionIfNoMoreCardToPick);
    },
    getSelectedCards() {
      return selectedCards.map(c => c.card);
    },
    getPreviousSessionNumber,
  };
};

module.exports = {
  FlashCards,
};
