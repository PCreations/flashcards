const { TestFlashCards } = require('./testFlashCards');

describe('given 3 boxes [c1,c3][c2][c4,c5]', () => {
  describe('when in session5', () => {
    let flashCards, box1, box2, box3;
    beforeEach(() => {
      box1 = ['c1', 'c3'];
      box2 = ['c2'];
      box3 = ['c4', 'c5'];
      flashCards = TestFlashCards({
        boxes: [box1, box2, box3],
      });
      flashCards.startSession(5);
    });
    test('then the selected cards should be c1,c3,c2', () => {
      expect(flashCards.getSelectedCards()).toEqual(['c1', 'c3', 'c2']);
    });
    describe('and c1 & c2 having been correctly answered', () => {
      test('then the boxes should be [c3][c1][c4, c5, c2]', () => {
        flashCards.notifyGoodAnswer(); //c1
        flashCards.notifyWrongAnswer(); //c3
        flashCards.notifyGoodAnswer(); //c2
        expect(box1).toEqual(['c3']);
        expect(box2).toEqual(['c1']);
        expect(box3).toEqual(['c4', 'c5', 'c2']);
      });
    });
  });
});
