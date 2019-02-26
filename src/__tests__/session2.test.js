const { FlashCards } = require('../flashCards');

describe('given 3 boxes [c1,c3][c2,c4,c5][]', () => {
  describe('when in session2', () => {
    let flashCards, box1, box2, box3;
    beforeEach(() => {
      box1 = ['c1', 'c3'];
      box2 = ['c2', 'c4', 'c5'];
      box3 = [];
      flashCards = FlashCards({
        boxes: [box1, box2, box3],
      });
      flashCards.startSession(2);
    });
    test('then the selected cards should be c1,c3', () => {
      expect(flashCards.getSelectedCards()).toEqual(['c1', 'c3']);
    });
    describe('and c1 and is correctly answered but not c3', () => {
      test('then the boxes should be [c3][c2,c4,c5,c1][]', () => {
        flashCards.notifyGoodAnswer();
        flashCards.notifyWrongAnswer();
        expect(box1).toEqual(['c3']);
        expect(box2).toEqual(['c2', 'c4', 'c5', 'c1']);
        expect(box3).toEqual([]);
      });
    });
  });
});
