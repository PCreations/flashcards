const { TestFlashCards } = require('./testFlashCards');

describe('given 3 boxes [c1,c2,c3][][]', () => {
  describe('when creating a new card c4', () => {
    let flashCards;
    beforeEach(async () => {
      const box1 = ['c1', 'c2', 'c3'];
      const box2 = [];
      const box3 = [];
      const boxes = [box1, box2, box3];
      flashCards = TestFlashCards({
        boxes,
      });
      await flashCards.startSession(1);
    });
    test('then the boxes should be [c1,c2,c3,c4][][]', async () => {
      await flashCards.addCard('c4');
      const [box1, box2, box3] = await flashCards.getBoxes();
      expect(box1).toEqual(['c1', 'c2', 'c3', 'c4']);
      expect(box2).toEqual([]);
      expect(box3).toEqual([]);
    });
  });
});
