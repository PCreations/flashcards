const { TestFlashCards } = require('./testFlashCards');

describe('given 3 boxes [c1,c2,c3][][]', () => {
  describe('when in session1', () => {
    let flashCards, box1, box2, box3;
    beforeEach(() => {
      box1 = ['c1', 'c2', 'c3'];
      box2 = [];
      box3 = [];
      const boxes = [box1, box2, box3];
      flashCards = TestFlashCards({
        boxes,
      });
      flashCards.startSession(1);
    });
    test('then the selected cards should be c1,c2,c3', () => {
      expect(flashCards.getSelectedCards()).toEqual(['c1', 'c2', 'c3']);
    });
    describe('and c1 and c3 are correctly answered but not c2', () => {
      test('then the boxes should be [c2][c1,c3][]', () => {
        flashCards.notifyGoodAnswer();
        flashCards.notifyWrongAnswer();
        flashCards.notifyGoodAnswer();
        expect(box1).toEqual(['c2']);
        expect(box2).toEqual(['c1', 'c3']);
        expect(box3).toEqual([]);
      });
    });
  });
});
