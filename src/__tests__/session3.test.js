const { FlashCards } = require('../flashCards');

describe('given 3 boxes [c1,c3][c2,c4,c5][]', () => {
  describe('when in session3', () => {
    let flashCards, box1, box2, box3;
    beforeEach(() => {
      box1 = ['c1', 'c3'];
      box2 = ['c2', 'c4', 'c5'];
      box3 = [];
      flashCards = FlashCards({
        boxes: [box1, box2, box3],
      });
      flashCards.startSession(3);
    });
    test('then the selected cards should be c1,c3,c2,c4,c5', () => {
      expect(flashCards.getSelectedCards()).toEqual(['c1', 'c3', 'c2', 'c4', 'c5']);
    });
    describe('and c1, c2, c5 having been correctly answered', () => {
      test('then the boxes should be [c3, c4][][c1,c2,c5]', () => {
        flashCards.notifyGoodAnswer(); //c1
        flashCards.notifyWrongAnswer(); //c3
        flashCards.notifyGoodAnswer(); //c2
        flashCards.notifyWrongAnswer(); //c4
        flashCards.notifyGoodAnswer(); //c5
        expect(box1).toEqual(['c3', 'c4']);
        expect(box2).toEqual([]);
        expect(box3).toEqual(['c1', 'c2', 'c5']);
      });
    });
  });
});
