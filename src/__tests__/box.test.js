const { createBox, addFlashcard } = require('../box');
const { createFlashcard } = require('../createFlashcard');

const createTestBox = ({ name = 'box name', partitions } = {}) => createBox({ name, partitions });

describe('box', () => {
  describe('createBox', () => {
    test('should accept an object with required not empty string property "name"', () => {
      expect(() => createBox()).toThrowError('missing properties "name"');
      expect(() => createBox({ name: '' })).toThrowError('missing properties "name"');
      expect(() => createBox({ name: 'box name' })).not.toThrow();
    });
    test('should accept a optional "partitions" property : an array of length 5', () => {
      expect(() => createTestBox({ partitions: 'bad format' })).toThrowError(
        'partitions should be an array of length 5',
      );
      expect(() => createTestBox({ partitions: [] })).toThrowError(
        'partitions should be an array of length 5',
      );
    });
    test('should return an immutable object', () => {
      const box = createBox({ name: 'box name' });
      box.name = 'other box name';
      expect(box.name).toBe('box name');
    });
    test('should have five empty partitions by default', () => {
      const box = createBox({ name: 'box name' });
      expect(box.partitions).toEqual([[], [], [], [], []]);
    });
  });

  describe('addFlashcard', () => {
    test('given a box with empty partitions it should add the flashcard in the first partition', () => {
      const theFlashcard = createFlashcard({ answer: 'answer', question: 'question' });
      const box = createTestBox();
      const boxWithFlashcard = addFlashcard({
        box,
        flashcard: theFlashcard,
      });
      expect(boxWithFlashcard.partitions[0]).toContainEqual(theFlashcard);
      expect(box.partitions).toEqual([[], [], [], [], []]);
    });
  });
});
