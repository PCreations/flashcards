const { TestFlashCards, c1, c2, c3, c4, c5 } = require('./testFlashCards');

describe('given 3 boxes [c1,c3][c2][c4,c5] and previous session was session 3', () => {
  describe('when starting a session', () => {
    let flashCards;
    beforeEach(async () => {
      const box1 = [c1, c3];
      const box2 = [c2];
      const box3 = [c4, c5];
      flashCards = await TestFlashCards({
        boxes: [box1, box2, box3],
        previousSessionNumber: 3,
      });
      await flashCards.startSession(4);
    });
    test('then the selected cards should be c1,c3,c4,c5', () => {
      expect(flashCards.getSelectedCards()).toEqual([c1, c3, c4, c5]);
    });
    describe('and c1 & c4 having been correctly answered', () => {
      test('then the boxes should be [c3, c5][c2, c1][] and previous session set to 4', async () => {
        await flashCards.notifyGoodAnswer(); //c1
        await flashCards.notifyWrongAnswer(); //c3
        await flashCards.notifyGoodAnswer(); //c4
        await flashCards.notifyWrongAnswer(); //c5
        const [box1, box2, box3] = await flashCards.getBoxes();
        expect(box1).toEqual([c3, c5]);
        expect(box2).toEqual([c2, c1]);
        expect(box3).toEqual([]);
        expect(await flashCards.getPreviousSessionNumber()).toEqual(4);
      });
    });
  });
});
