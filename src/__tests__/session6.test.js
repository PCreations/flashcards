const { TestFlashCards, c1, c2, c3, c4, c5 } = require('./testFlashCards');

describe('given 3 boxes [c1,c3][c2][c4,c5]', () => {
  describe('when in session6', () => {
    let flashCards;
    beforeEach(async () => {
      const box1 = [c1, c3];
      const box2 = [c2];
      const box3 = [c4, c5];
      flashCards = await TestFlashCards({
        boxes: [box1, box2, box3],
      });
      await flashCards.startSession(6);
    });
    test('then the selected cards should be c1,c3', () => {
      expect(flashCards.getSelectedCards()).toEqual([c1, c3]);
    });
    describe('and c1 having been correctly answered', () => {
      test('then the boxes should be [c3][c2,c1][c4,c5]', async () => {
        await flashCards.notifyGoodAnswer(); //c1
        await flashCards.notifyWrongAnswer(); //c3
        const [box1, box2, box3] = await flashCards.getBoxes();
        expect(box1).toEqual([c3]);
        expect(box2).toEqual([c2, c1]);
        expect(box3).toEqual([c4, c5]);
      });
    });
  });
});
