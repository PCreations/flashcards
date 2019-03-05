const { TestFlashCards, c1, c2, c3, c4, c5 } = require('./testFlashCards');

describe('given 3 boxes [c1,c2,c3][c4][] and there was no previous session', () => {
  describe('when starting a session', () => {
    let flashCards;
    beforeEach(async () => {
      const box1 = [c1, c2, c3];
      const box2 = [c4];
      const box3 = [];
      flashCards = await TestFlashCards({
        boxes: [box1, box2, box3],
      });
      await flashCards.startSession();
    });
    test('then the selected cards should be c1,c2,c3', () => {
      expect(flashCards.getSelectedCards()).toEqual([c1, c2, c3]);
    });
    describe('and c1 and c3 are correctly answered but not c2', () => {
      test('then the boxes should be [c2][c4, c1,c3][] and previous session set to 1', async () => {
        await flashCards.notifyGoodAnswer();
        await flashCards.notifyWrongAnswer();
        await flashCards.notifyGoodAnswer();
        const [box1, box2, box3] = await flashCards.getBoxes();
        expect(box1).toEqual([c2]);
        expect(box2).toEqual([c4, c1, c3]);
        expect(box3).toEqual([]);
        expect(await flashCards.getPreviousSessionNumber()).toEqual(1);
      });
    });
  });
});

describe('given 3 boxes [c1,c3][c2][c4,c5] and previous session was session 7', () => {
  describe('when starting a session', () => {
    let flashCards;
    beforeEach(async () => {
      const box1 = [c1, c3];
      const box2 = [c2];
      const box3 = [c4, c5];
      flashCards = await TestFlashCards({
        boxes: [box1, box2, box3],
        previousSessionNumber: 7,
      });
      await flashCards.startSession();
    });
    test('then the selected cards should be c1,c3', () => {
      expect(flashCards.getSelectedCards()).toEqual([c1, c3]);
    });
    describe('and c1 is correctly answered but not c3', () => {
      test('then the boxes should be [c3][c2, c1][c4, c5] and previous session set to 1', async () => {
        await flashCards.notifyGoodAnswer();
        await flashCards.notifyWrongAnswer();
        const [box1, box2, box3] = await flashCards.getBoxes();
        expect(box1).toEqual([c3]);
        expect(box2).toEqual([c2, c1]);
        expect(box3).toEqual([c4, c5]);
        expect(await flashCards.getPreviousSessionNumber()).toEqual(1);
      });
    });
  });
});
