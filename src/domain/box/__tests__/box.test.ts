import dayjs from 'dayjs';
import { getFlashcard, addFlashcard, startSession } from '../box';
import { createBox } from '../../../../testsUtils/helpers/dataCreators';

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
    expect(box.sessionsPartitions).toEqual([]);
  });
});

const getBox = () =>
  createBox({
    boxName: 'test',
    partitions: [
      [
        {
          question: 'some question',
          answer: 'some answer',
        },
        {
          question: 'some question 2',
          answer: 'some answer 2',
        },
      ],
      [
        {
          question: 'some question 3',
          answer: 'some answer 3',
        },
      ],
      [
        {
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
    expect(box.partitions[1].concat(box.partitions[2], box.partitions[3])).toEqual([
      {
        question: 'some question',
        answer: 'some answer',
      },
      {
        question: 'some question 2',
        answer: 'some answer 2',
      },
      {
        question: 'some question 3',
        answer: 'some answer 3',
      },
      {
        question: 'some question 4',
        answer: 'some answer 4',
      },
    ]);
  });
  describe('when retrieving the flashcard in 2nd position in partition 1', () => {
    test('then the correct flashcard should be retrieved', () => {
      const box = getBox();
      const { question, answer } = getFlashcard({ box, partition: 1, position: 2 });
      expect({ question, answer }).toEqual({
        question: 'some question 2',
        answer: 'some answer 2',
      });
    });
  });
});

describe('given a box named "test" and containing some flashcards in its first partition', () => {
  describe('when adding a new flashcard in partition 1', () => {
    test('then the partition 1 should now contain the new flashcard in addition to flashcards already present', () => {
      const box = getBox();

      const updatedBox = addFlashcard({
        flashcard: { question: 'some question 5', answer: 'some answer 5' },
        partition: 1,
      })(box);

      expect(updatedBox.partitions[1]).toEqual([
        {
          question: 'some question',
          answer: 'some answer',
        },
        {
          question: 'some question 2',
          answer: 'some answer 2',
        },
        {
          question: 'some question 5',
          answer: 'some answer 5',
        },
      ]);
    });
  });
  describe('and today is 2019-04-01', () => {
    describe('when starting a session for the first time', () => {
      test('then the selected deck should contain cards from partition 2 and 1 according to the leitner schedule and the startedAt date should be set to 2019-04-01', () => {
        const box = startSession(dayjs('2019-04-01').toDate())(getBox());
        expect(box.sessionsPartitions).toEqual([2, 1]);
      });
    });
  });
});
