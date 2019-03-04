const { TestFlashCards, c1, c2, c3 } = require('./testFlashCards');

describe('given 3 boxes [c1,c2,c3][][]', () => {
  describe('when in session1', () => {
    let flashCards;
    beforeEach(async () => {
      const box1 = [c1, c2, c3];
      const box2 = [];
      const box3 = [];
      flashCards = await TestFlashCards({
        boxes: [box1, box2, box3],
      });
      await flashCards.startSession(1);
    });
    test('then the selected cards should be c1,c2,c3', () => {
      expect(flashCards.getSelectedCards()).toEqual([c1, c2, c3]);
    });
    describe('and c1 and c3 are correctly answered but not c2', () => {
      test('then the boxes should be [c2][c1,c3][]', async () => {
        await flashCards.notifyGoodAnswer();
        await flashCards.notifyWrongAnswer();
        await flashCards.notifyGoodAnswer();
        const [box1, box2, box3] = await flashCards.getBoxes();
        expect(box1).toEqual([c2]);
        expect(box2).toEqual([c1, c3]);
        expect(box3).toEqual([]);
      });
    });
  });
});
