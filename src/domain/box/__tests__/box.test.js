const testDataCreators = require('../../../../tests/helpers/dataCreators');
const testDataViews = require('../../../../tests/helpers/dataViews');
const { Flashcard } = require('../flashcard');
describe('when creating an empty box named "test"', () => {
  test('the box should be correctly created', () => {
    const box = testDataCreators.createBox({
      boxName: 'test',
    });
    expect(box.name).toBe('test');
    expect(box.partitions).toEqual([[], [], [], [], [], [], []]);
  });
});

describe('when creating an empty box named "test"', () => {
  test('the box next session should be 1', () => {
    const box = testDataCreators.createBox({
      boxName: 'test',
    });
    expect(box.nextSession).toBe(1);
  });
});

describe('when creating a box named "test" and containing some flashcards in its first partition with next session being session 42', () => {
  test('the box next session should be 42', () => {
    const box = testDataCreators.createBox({
      boxName: 'test',
      partitions: [
        [
          {
            id: 'abc',
            question: 'some question',
            answer: 'some answer',
          },
          {
            id: 'def',
            question: 'some question 2',
            answer: 'some answer 2',
          },
        ],
      ],
      nextSession: '42',
    });
    expect(box.name).toBe('test');
    expect(box.nextSession).toBe(42);
  });
});

describe('when creating a box named "test" and containing some flashcards', () => {
  test('the box should be correctly created', () => {
    const box = testDataCreators.createBox({
      boxName: 'test',
      partitions: [
        [
          {
            id: 'abc',
            question: 'some question',
            answer: 'some answer',
          },
          {
            id: 'def',
            question: 'some question 2',
            answer: 'some answer 2',
          },
        ],
        [
          {
            id: 'ghi',
            question: 'some question 3',
            answer: 'some answer 3',
          },
        ],
        [
          {
            id: 'jkl',
            question: 'some question 4',
            answer: 'some answer 4',
          },
        ],
      ],
    });
    expect(box.name).toBe('test');
    expect(testDataViews.flashcardsInPartitions({ box, partitions: [1, 3] })).toEqual([
      {
        id: 'abc',
        question: 'some question',
        answer: 'some answer',
      },
      {
        id: 'def',
        question: 'some question 2',
        answer: 'some answer 2',
      },
      {
        id: 'jkl',
        question: 'some question 4',
        answer: 'some answer 4',
      },
    ]);
  });
});

describe('given a box named "test" and containing some flashcards in its first partition', () => {
  describe('when adding a new flashcard in partition 1', () => {
    test('then the partition 1 should now contain the new flashcard in addition to flashcards already present', () => {
      const box = testDataCreators.createBox({
        boxName: 'test',
        partitions: [
          [
            {
              id: 'abc',
              question: 'some question',
              answer: 'some answer',
            },
            {
              id: 'def',
              question: 'some question 2',
              answer: 'some answer 2',
            },
          ],
        ],
      });

      const updatedBox = box
        .addFlashcard(
          Flashcard.ofQuestion('some question 3')
            .withAnswer('some answer 3')
            .withId('ghi'),
        )
        .inPartition(1);

      expect(testDataViews.flashcardsInPartitions({ box: updatedBox, partitions: [1] })).toEqual([
        {
          id: 'abc',
          question: 'some question',
          answer: 'some answer',
        },
        {
          id: 'def',
          question: 'some question 2',
          answer: 'some answer 2',
        },
        {
          id: 'ghi',
          question: 'some question 3',
          answer: 'some answer 3',
        },
      ]);
    });
  });
});
