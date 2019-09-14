const { createBox } = require('../createBox');
const { addFlashcard } = require('../addFlashcard');
const { createFlashcard } = require('../createFlashcard');

describe('addFlashcard', () => {
  test('given a box with empty partitions it should add the flashcard in the first partition', () => {
    const theFlashcard = createFlashcard({ answer: 'answer', question: 'question' });
    const box = createBox({ name: 'some box' });
    const boxWithFlashcard = addFlashcard({
      box,
      flashcard: theFlashcard,
    });
    expect(boxWithFlashcard.partitions[0]).toContainEqual(theFlashcard);
    expect(box.partitions).toEqual([[], [], [], [], []]);
  });
});
