import dayjs from 'dayjs';
import { createBox } from '../../../../testsUtils/helpers/dataCreators';
import { flashcardsInDeck, flashcardsInPartitions } from '../../../../testsUtils/helpers/dataViews';
import { Flashcard } from '../flashcard';
import { NO_COMPLETED_SESSION_YET } from '../sessionNumber';

describe('when creating an empty box named "test"', () => {
  test('the box should be correctly created', () => {
    const box = createBox({
      boxName: 'test',
      ownedByPlayerWithId: '42',
    });
    expect(box.name).toBe('test');
    expect(box.playerId).toBe('42');
    expect(box.partitions).toEqual({ 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] });
    expect(box.startedAt).toBeUndefined();
    expect(box.sessionDeck).toEqual([]);
  });
});

const getBox = () =>
  createBox({
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

describe('when creating a box named "test" and containing some flashcards in its partitions 1, 2 and 3', () => {
  test('the box should be correctly initialized', () => {
    const box = getBox();
    expect(box.name).toBe('test');
    expect(box.startedAt).toBeUndefined();
    expect(flashcardsInPartitions({ box, partitions: [1, 2, 3] })).toEqual([
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
      const box = getBox();

      const updatedBox = box
        .addFlashcard(
          Flashcard.ofQuestion('some question 5')
            .withAnswer('some answer 5')
            .withId('mno'),
        )
        .inPartition(1);

      expect(flashcardsInPartitions({ box: updatedBox, partitions: [1] })).toEqual([
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
          id: 'mno',
          question: 'some question 5',
          answer: 'some answer 5',
        },
      ]);
    });
  });
  describe('and today is 2019-04-01', () => {
    describe('when starting a session for the first time', () => {
      test('then the selected deck should contain cards from partition 2 and 1 according to the leitner schedule and the startedAt date should be set to 2019-04-01', () => {
        const box = getBox().startSession(dayjs('2019-04-01').toDate());
        expect(flashcardsInDeck({ deck: box.sessionDeck })).toEqual(
          flashcardsInPartitions({
            box,
            partitions: [2, 1],
          }),
        );
      });
    });
  });
});
