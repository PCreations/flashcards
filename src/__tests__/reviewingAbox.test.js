const FlashCards = ({ boxes }) => {
  let boxInReview;
  let selectedCard;
  let _boxes = boxes;
  return {
    reviewBox(box) {
      boxInReview = box;
    },
    selectCard(card) {
      selectedCard = card;
    },
    notifyGoodAnswer() {
      _boxes[boxInReview] = _boxes[boxInReview].filter(card => card !== selectedCard);
      _boxes[1].push(selectedCard);
    },
    notifyWrongAnswer() {},
    getBoxes() {
      return _boxes;
    },
  };
};

describe.only('given 3 boxes [c1...c5][][] and box1 being reviewed and c1 being the selected card', () => {
  describe('when a correct answer is given to c1', () => {
    test('then the 3 boxes should be [c2...c5][c1][]', () => {
      const flashCards = FlashCards({
        boxes: [['c1', 'c2', 'c3', 'c4', 'c5'], [], []],
      });
      flashCards.reviewBox(0);
      flashCards.selectCard('c1');
      flashCards.notifyGoodAnswer();
      expect(flashCards.getBoxes()).toEqual([['c2', 'c3', 'c4', 'c5'], ['c1'], []]);
    });
  });
  describe('when a bad answer is given to c1', () => {
    test('then 3 boxes should remain unchanged', () => {
      const flashCards = FlashCards({
        boxes: [['c1', 'c2', 'c3', 'c4', 'c5'], [], []],
      });
      flashCards.reviewBox(0);
      flashCards.selectCard('c1');
      flashCards.notifyWrongAnswer();
      expect(flashCards.getBoxes()).toEqual([['c1', 'c2', 'c3', 'c4', 'c5'], [], []]);
    });
  });
});

describe('given 3 boxes [c2...c5][c1][] and box2 being reviewed and c1 being the selected card', () => {
  describe('when a correct answer is given to c1', () => {
    test('then the 3 boxes should be [c2...c5][][c1]', () => {});
  });
  describe('when a bad answer is given to c1', () => {
    test('then 3 boxes should be [c1...c5][][]', () => {});
  });
});

describe('given 3 boxes [c2...c5][][c1] and box3 being reviewed and c1 being the selected card', () => {
  describe('when a correct answer is given to c1', () => {
    test('then the 3 boxes should be [c2...c5][][] and c1 being archived', () => {});
  });
  describe('when a bad answer is given to c1', () => {
    test('then 3 boxes should be [c1...c5][][]', () => {});
  });
});
