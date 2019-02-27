const FlashCards = ({ boxes }) => {
  let currentSession;
  let selectedCards;
  return {
    startSession(sessionNumber) {
      currentSession = sessionNumber;
      if (currentSession === 1 || currentSession === 2 || currentSession === 6) {
        selectedCards = boxes[0];
      } else if (currentSession === 3 || currentSession === 5) {
        selectedCards = boxes[0].concat(boxes[1]);
      } else if (currentSession === 4) {
        selectedCards = boxes[0].concat(boxes[2]);
      } else {
        selectedCards = boxes[0].concat(boxes[1], boxes[2]);
      }
    },
    notifyGoodAnswer() {
      const answeredCard = selectedCards[0];
      selectedCards = selectedCards.slice(1, selectedCards.lenght);
      if (currentSession === 1 || currentSession === 2 || currentSession === 6) {
        boxes[0].splice(boxes[0].indexOf(answeredCard), 1);
        boxes[1].push(answeredCard);
      } else if (currentSession === 3 || currentSession === 5) {
        const indexOfAnsweredCardInBox1 = boxes[0].indexOf(answeredCard);
        const indexOfAnsweredCardInBox2 = boxes[1].indexOf(answeredCard);
        if (indexOfAnsweredCardInBox1 !== -1) {
          boxes[0].splice(indexOfAnsweredCardInBox1, 1);
          boxes[1].push(answeredCard);
        } else {
          boxes[1].splice(indexOfAnsweredCardInBox2, 1);
          boxes[2].push(answeredCard);
        }
      } else if (currentSession === 4) {
        const indexOfAnsweredCardInBox1 = boxes[0].indexOf(answeredCard);
        const indexOfAnsweredCardInBox3 = boxes[2].indexOf(answeredCard);
        if (indexOfAnsweredCardInBox1 !== -1) {
          boxes[0].splice(indexOfAnsweredCardInBox1, 1);
          boxes[1].push(answeredCard);
        } else {
          boxes[2].splice(indexOfAnsweredCardInBox3, 1);
        }
      } else {
        const indexOfAnsweredCardInBox1 = boxes[0].indexOf(answeredCard);
        const indexOfAnsweredCardInBox2 = boxes[1].indexOf(answeredCard);
        const indexOfAnsweredCardInBox3 = boxes[2].indexOf(answeredCard);
        if (indexOfAnsweredCardInBox1 !== -1) {
          boxes[0].splice(indexOfAnsweredCardInBox1, 1);
          boxes[1].push(answeredCard);
        } else if (indexOfAnsweredCardInBox2 !== -1) {
          boxes[1].splice(indexOfAnsweredCardInBox2, 1);
          boxes[2].push(answeredCard);
        } else {
          boxes[2].splice(indexOfAnsweredCardInBox3, 1);
        }
      }
    },
    notifyWrongAnswer() {
      const answeredCard = selectedCards[0];
      if (currentSession === 3 || currentSession === 5) {
        const indexOfAnsweredCardInBox2 = boxes[1].indexOf(answeredCard);
        if (indexOfAnsweredCardInBox2 !== -1) {
          boxes[1].splice(indexOfAnsweredCardInBox2, 1);
          boxes[0].push(answeredCard);
        }
      } else if (currentSession === 4) {
        const indexOfAnsweredCardInBox3 = boxes[2].indexOf(answeredCard);
        if (indexOfAnsweredCardInBox3 !== -1) {
          boxes[2].splice(indexOfAnsweredCardInBox3, 1);
          boxes[0].push(answeredCard);
        }
      } else if (currentSession === 7) {
        const indexOfAnsweredCardInBox2 = boxes[1].indexOf(answeredCard);
        const indexOfAnsweredCardInBox3 = boxes[2].indexOf(answeredCard);
        if (indexOfAnsweredCardInBox2 !== -1) {
          boxes[1].splice(indexOfAnsweredCardInBox2, 1);
          boxes[0].push(answeredCard);
        } else if (indexOfAnsweredCardInBox3 !== -1) {
          boxes[2].splice(indexOfAnsweredCardInBox3, 1);
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
