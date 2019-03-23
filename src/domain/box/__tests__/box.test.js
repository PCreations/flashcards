const testDataCreators = require('../../../../tests/helpers/dataCreators');
const testDataViews = require('../../../../tests/helpers/dataViews');

const { Box } = require('../box');
const { Player } = require('../../player/player');
const { Flashcard } = require('../flashcard');

describe('when creating an empty box named "test"', () => {
  test('the box should be correctly created', () => {
    const box = testDataCreators.createBox({
      boxName: 'test',
      flashcards: [],
    });
    expect(box.name).toBe('test');
    expect(box.partitions).toEqual([[]]);
  });
});

describe('when creating a box named "test" and containing some flashcards in its first partition', () => {
  test('the box should be correctly created', () => {
    const box = testDataCreators.createBox({
      boxName: 'test',
      flashcards: [
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
    });
    expect(box.name).toBe('test');
    expect(testDataViews.flashcardsView(box.getFlashcardsInPartition(1))).toEqual([
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
    ]);
  });
});

describe('given a box named "test" and containing some flashcards in its first partition', () => {
  describe('when adding a new flashcard in partition 1', () => {
    test('then the partition 1 should now contain the new flashcard in addition to flashcards already present', () => {
      const box = testDataCreators.createBox({
        boxName: 'test',
        flashcards: [
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
      });

      const updatedBox = box
        .addFlashcard(
          Flashcard.ofQuestion('some question 3')
            .withAnswer('some answer 3')
            .withId('ghi'),
        )
        .inPartition(1);

      expect(testDataViews.flashcardsView(updatedBox.getFlashcardsInPartition(1))).toEqual([
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
