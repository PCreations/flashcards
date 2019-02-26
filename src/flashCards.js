const FlashCards = ({ boxes }) => {
  let currentSession;
  let selectedCards;
  return {
    startSession(sessionNumber) {
      currentSession = sessionNumber;
      if (currentSession === 1 || currentSession === 2) {
        selectedCards = boxes[0];
      } else if (currentSession === 3) {
        selectedCards = boxes[0].concat(boxes[1]);
      }
    },
    notifyGoodAnswer() {
      const answeredCard = selectedCards[0];
      selectedCards = selectedCards.slice(1, selectedCards.lenght);
      if (currentSession === 1 || currentSession === 2) {
        boxes[0].splice(boxes[0].indexOf(answeredCard), 1);
        boxes[1].push(answeredCard);
      } else if (currentSession === 3) {
        const indexOfAnsweredCardInBox1 = boxes[0].indexOf(answeredCard);
        const indexOfAnsweredCardInBox2 = boxes[1].indexOf(answeredCard);
        if (indexOfAnsweredCardInBox1 !== -1) {
          boxes[0].splice(indexOfAnsweredCardInBox1, 1);
        } else {
          boxes[1].splice(indexOfAnsweredCardInBox2, 1);
        }
        boxes[2].push(answeredCard);
      }
    },
    notifyWrongAnswer() {
      const answeredCard = selectedCards[0];
      if (currentSession === 3) {
        const indexOfAnsweredCardInBox2 = boxes[1].indexOf(answeredCard);
        if (indexOfAnsweredCardInBox2 !== -1) {
          boxes[1].splice(indexOfAnsweredCardInBox2, 1);
          boxes[0].push(answeredCard);
        }
      }
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
