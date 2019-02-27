const moveCard = ({ removeCardFromBox = async () => {}, addCardInBox = async () => {} } = {}) => card =>
  removeCardFromBox(card).then(addCardInBox);

const removeCardFromBox = ({ getCardFromBox, removeCardFromBox }) => boxNumber => {};

const FlashCards = ({ boxes, getCardsFromBoxes }) => {
  let currentSession;
  let selectedCards;
  return {
    startSession(sessionNumber) {
      currentSession = sessionNumber;
      if (currentSession === 1 || currentSession === 2 || currentSession === 6) {
        selectedCards = getCardsFromBoxes(1);
      } else if (currentSession === 3 || currentSession === 5) {
        selectedCards = getCardsFromBoxes(1, 2);
      } else if (currentSession === 4) {
        selectedCards = getCardsFromBoxes(1, 3);
      } else {
        selectedCards = getCardsFromBoxes(1, 2, 3);
      }
    },
    notifyGoodAnswer() {
      const { card, boxNumber } = selectedCards[0];
      selectedCards = selectedCards.slice(1, selectedCards.lenght);
      if (currentSession === 1 || currentSession === 2 || currentSession === 6) {
        boxes[0].splice(boxes[0].indexOf(card), 1);
        boxes[1].push(card);
      } else if (currentSession === 3 || currentSession === 5) {
        const indexOfAnsweredCardInBox1 = boxes[0].indexOf(card);
        const indexOfAnsweredCardInBox2 = boxes[1].indexOf(card);
        if (indexOfAnsweredCardInBox1 !== -1) {
          boxes[0].splice(indexOfAnsweredCardInBox1, 1);
          boxes[1].push(card);
        } else {
          boxes[1].splice(indexOfAnsweredCardInBox2, 1);
          boxes[2].push(card);
        }
      } else if (currentSession === 4) {
        const indexOfAnsweredCardInBox1 = boxes[0].indexOf(card);
        const indexOfAnsweredCardInBox3 = boxes[2].indexOf(card);
        if (indexOfAnsweredCardInBox1 !== -1) {
          boxes[0].splice(indexOfAnsweredCardInBox1, 1);
          boxes[1].push(card);
        } else {
          boxes[2].splice(indexOfAnsweredCardInBox3, 1);
        }
      } else {
        const indexOfAnsweredCardInBox1 = boxes[0].indexOf(card);
        const indexOfAnsweredCardInBox2 = boxes[1].indexOf(card);
        const indexOfAnsweredCardInBox3 = boxes[2].indexOf(card);
        if (indexOfAnsweredCardInBox1 !== -1) {
          boxes[0].splice(indexOfAnsweredCardInBox1, 1);
          boxes[1].push(card);
        } else if (indexOfAnsweredCardInBox2 !== -1) {
          boxes[1].splice(indexOfAnsweredCardInBox2, 1);
          boxes[2].push(card);
        } else {
          boxes[2].splice(indexOfAnsweredCardInBox3, 1);
        }
      }
    },
    notifyWrongAnswer() {
      const { card, boxNumber } = selectedCards[0];
      if (currentSession === 3 || currentSession === 5) {
        const indexOfAnsweredCardInBox2 = boxes[1].indexOf(card);
        if (indexOfAnsweredCardInBox2 !== -1) {
          boxes[1].splice(indexOfAnsweredCardInBox2, 1);
          boxes[0].push(card);
        }
      } else if (currentSession === 4) {
        const indexOfAnsweredCardInBox3 = boxes[2].indexOf(card);
        if (indexOfAnsweredCardInBox3 !== -1) {
          boxes[2].splice(indexOfAnsweredCardInBox3, 1);
          boxes[0].push(card);
        }
      } else if (currentSession === 7) {
        const indexOfAnsweredCardInBox2 = boxes[1].indexOf(card);
        const indexOfAnsweredCardInBox3 = boxes[2].indexOf(card);
        if (indexOfAnsweredCardInBox2 !== -1) {
          boxes[1].splice(indexOfAnsweredCardInBox2, 1);
          boxes[0].push(card);
        } else if (indexOfAnsweredCardInBox3 !== -1) {
          boxes[2].splice(indexOfAnsweredCardInBox3, 1);
          boxes[0].push(card);
        }
      }
      selectedCards = selectedCards.slice(1, selectedCards.length);
    },
    getSelectedCards() {
      debugger;
      return selectedCards.map(c => c.card);
    },
  };
};

module.exports = {
  FlashCards,
};
