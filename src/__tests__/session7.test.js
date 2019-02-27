const { TestFlashCards } = require('./testFlashCards');

describe('given 3 boxes [c1,c3][c2][c4,c5]', () => {
  describe('when in session7', () => {
    let flashCards;
    beforeEach(async () => {
      box1 = ['c1', 'c3'];
      box2 = ['c2'];
      box3 = ['c4', 'c5'];
      flashCards = TestFlashCards({
        boxes: [box1, box2, box3],
      });
      await flashCards.startSession(7);
    });
    test('then the selected cards should be c1,c3,c2,c4,c5', () => {
      expect(flashCards.getSelectedCards()).toEqual(['c1', 'c3', 'c2', 'c4', 'c5']);
    });
    describe('and c1, c2, c4 having been correctly answered', () => {
      test('then the boxes should be [c3, c5][c1][c2]', async () => {
        await flashCards.notifyGoodAnswer(); //c1
        await flashCards.notifyWrongAnswer(); //c3
        await flashCards.notifyGoodAnswer(); //c2
        await flashCards.notifyGoodAnswer(); //c4
        await flashCards.notifyWrongAnswer(); //c5
        const [box1, box2, box3] = await flashCards.getBoxes();
        expect(box1).toEqual(['c3', 'c5']);
        expect(box2).toEqual(['c1']);
        expect(box3).toEqual(['c2']);
      });
    });
  });
});