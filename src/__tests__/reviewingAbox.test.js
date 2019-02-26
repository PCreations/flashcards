const FlashCards = ({ boxes }) => {
  let currentSession;
  let selectedCards;
  return {
    startSession(sessionNumber) {
      currentSession = sessionNumber;
      if (currentSession === 1) {
        selectedCards = boxes[0];
      }
    },
    notifyGoodAnswer() {
      const answeredCard = selectedCards[0];
      selectedCards = selectedCards.slice(1, selectedCards.lenght);
      if (currentSession === 1) {
        boxes[0].splice(boxes[0].indexOf(answeredCard), 1);
        boxes[1].push(answeredCard);
      }
    },
    notifyWrongAnswer() {},
    getSelectedCards() {
      return selectedCards;
    },
    getNextCardToAnswer() {
      return selectedCards[0];
    },
  };
};

describe('given 3 boxes [c1...c5][][]', () => {
  describe('when session 1 starts', () => {
    test('then the selected cards should be [c1...c5] and the next card to answer should be c1', () => {
      const box1 = ['c1', 'c2', 'c3', 'c4', 'c5'];
      const box2 = [];
      const box3 = [];
      const flashCards = FlashCards({
        boxes: [box1, box2, box3],
      });
      flashCards.startSession(1);
      expect(flashCards.getSelectedCards()).toEqual(box1);
      expect(flashCards.getNextCardToAnswer()).toEqual('c1');
    });
  });
  describe('and given session 1 has started and c1 being the next card to answer', () => {
    describe('when giving a good answer', () => {
      test('then the boxes should be [c2...c5][c1][]', () => {
        const box1 = ['c1', 'c2', 'c3', 'c4', 'c5'];
        const box2 = [];
        const box3 = [];
        const flashCards = FlashCards({
          boxes: [box1, box2, box3],
        });
        flashCards.startSession(1);
        flashCards.notifyGoodAnswer();
        expect(box1).toEqual(['c2', 'c3', 'c4', 'c5']);
        expect(box2).toEqual(['c1']);
        expect(box3).toEqual([]);
      });
    });
    describe('when giving a bad answer', () => {
      test('then the boxes should remain unchanged', () => {
        const box1 = ['c1', 'c2', 'c3', 'c4', 'c5'];
        const box2 = [];
        const box3 = [];
        const flashCards = FlashCards({
          boxes: [box1, box2, box3],
        });
        flashCards.startSession(1);
        flashCards.notifyWrongAnswer();
        expect(box1).toEqual(['c1', 'c2', 'c3', 'c4', 'c5']);
        expect(box2).toEqual([]);
        expect(box3).toEqual([]);
      });
    });
  });
});
