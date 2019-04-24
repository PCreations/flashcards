import dayjs from 'dayjs';
import last from 'lodash/last';
import { createBox } from '../../../../testsUtils/helpers/dataCreators';
import { addFlashcard, startSession, notifyGoodAnswer, Box, notifyWrongAnswer } from '../box';

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
    expect(box.sessionFlashcards).toEqual([]);
    expect(box.sessionScore).toBe(0);
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
      test('then the selected questions should contain questions from partition 2 and 1 according to the leitner schedule and the startedAt date should be set to 2019-04-01', () => {
        const box = startSession(dayjs('2019-04-01').toDate())(getBox());
        expect(box.sessionsPartitions).toEqual([2, 1]);
        expect(box.sessionFlashcards).toEqual([
          {
            question: 'some question 3',
            answer: 'some answer 3',
          },
          {
            question: 'some question',
            answer: 'some answer',
          },
          {
            question: 'some question 2',
            answer: 'some answer 2',
          },
        ]);
      });
    });
  });
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
});

describe('notifying a good answer', () => {
  describe('given a box where the current session score is 0 and the session deck contains 1 flashcard from partition 2 and 1 flashcard from partition 1, and the currently reviewing flashcard is the flashcard from partition 2', () => {
    describe('when notifying a good answer', () => {
      const getTestBox = (): Box => {
        const box = getBox();
        return notifyGoodAnswer({
          ...box,
          sessionFlashcards: [
            {
              question: 'some question 3',
              answer: 'some answer 3',
            },
            {
              question: 'some question',
              answer: 'some answer',
            },
          ],
          sessionScore: 0,
        });
      };
      test('then the box score should be 1', () => {
        const box = getTestBox();
        expect(box.sessionScore).toBe(1);
      });
      test('then the flashcard should be moved to the end of partition 3', () => {
        const box = getTestBox();
        expect(box.partitions[2]).toEqual([]);
        expect(last(box.partitions[3])).toEqual({
          question: 'some question 3',
          answer: 'some answer 3',
        });
      });
      test('then the new current flashcard to review should be the one from partition 1 at position 1', () => {
        const box = getTestBox();
        expect(box.sessionFlashcards[0]).toEqual({
          question: 'some question',
          answer: 'some answer',
        });
      });
    });
  });
  describe('given a box where the session deck contains 1 flashcard from partition 7', () => {
    describe('when notifying a good answer', () => {
      const getTestBox = (): Box => {
        const box = getBox();
        return notifyGoodAnswer({
          ...box,
          partitions: {
            ...box.partitions,
            7: [
              {
                question: 'some question 7',
                answer: 'some answer 7',
              },
            ],
          },
          sessionFlashcards: [
            {
              question: 'some question 7',
              answer: 'some answer 7',
            },
          ],
          sessionScore: 0,
        });
      };
      test('then the flashcard should be archived', () => {
        const box = getTestBox();
        expect(box.archivedFlashcards).toContainEqual({
          question: 'some question 7',
          answer: 'some answer 7',
        });
      });
    });
  });
});

describe('notifying a wrong answer', () => {
  describe('given a box where the current session score is 5 and the session deck contains 1 flashcard from partition 3 and 2 flashcards from partition 1, and the currently reviewing flashcard is the flashcard from partition 3', () => {
    describe('when notifying a wrong answer', () => {
      const getTestBox = (): Box => {
        const box = getBox();
        return notifyWrongAnswer({
          ...box,
          sessionFlashcards: [
            {
              question: 'some question 4',
              answer: 'some answer 4',
            },
            {
              question: 'some question',
              answer: 'some answer',
            },
            {
              question: 'some question 2',
              answer: 'some answer 2',
            },
          ],
          sessionScore: 5,
        });
      };
      test('then the box score should still be 5', () => {
        const box = getTestBox();
        expect(box.sessionScore).toBe(5);
      });
      test('then the flashcard should be moved back to the end of partition 1', () => {
        const box = getTestBox();
        expect(box.partitions[3]).toEqual([]);
        expect(last(box.partitions[1])).toEqual({
          question: 'some question 4',
          answer: 'some answer 4',
        });
      });
      test('then the new current flashcard to review should be the one from partition 1 at position 1', () => {
        const box = getTestBox();
        expect(box.partitions[1][0]).toEqual({
          question: 'some question',
          answer: 'some answer',
        });
      });
    });
  });
});
