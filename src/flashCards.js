const FlashCards = ({ boxes }) => {
  let currentSession;
  let selectedCards;
  return {
    startSession(sessionNumber) {
      currentSession = sessionNumber;
      if (currentSession === 1 || currentSession === 2) {
        selectedCards = boxes[0];
      }
    },
    notifyGoodAnswer() {
      const answeredCard = selectedCards[0];
      selectedCards = selectedCards.slice(1, selectedCards.lenght);
      if (currentSession === 1 || currentSession === 2) {
        boxes[0].splice(boxes[0].indexOf(answeredCard), 1);
        boxes[1].push(answeredCard);
      }
    },
    notifyWrongAnswer() {
      selectedCards = selectedCards.slice(1, selectedCards.lenght);
    },
    getSelectedCards() {
      return selectedCards;
    },
  };
};

module.exports = {
  FlashCards,
};
