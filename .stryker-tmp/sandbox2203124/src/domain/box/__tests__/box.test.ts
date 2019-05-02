import { OrderedSet, Stack } from 'immutable';
import dayjs from 'dayjs';
import identity from 'lodash/identity';
import {
  addFlashcard,
  startSession,
  notifyGoodAnswer,
  Box,
  notifyWrongAnswer,
  mapBox,
  SessionFlashcard,
} from '../box';
import { Flashcard } from '../flashcard';
import { mapPartitions, addFlashcardInPartition } from '../partitions';

const flashcards = [
  Flashcard({ question: 'some question', answer: 'some answer' }),
  Flashcard({ question: 'some question 2', answer: 'some answer 2' }),
  Flashcard({ question: 'some question 3', answer: 'some answer 3' }),
  Flashcard({ question: 'some question 4', answer: 'some answer 4' }),
];

const getBox = (): Box =>
  mapBox(box =>
    box
      .set('name', 'test')
      .set('playerId', '42')
      .update(
        'partitions',
        mapPartitions(
          addFlashcardInPartition({ partition: 1, flashcard: flashcards[0] }),
          addFlashcardInPartition({ partition: 1, flashcard: flashcards[1] }),
          addFlashcardInPartition({ partition: 2, flashcard: flashcards[2] }),
          addFlashcardInPartition({ partition: 3, flashcard: flashcards[3] }),
        ),
      ),
  )();

describe('when creating an box named "test" from default box', () => {
  test('the box should be correctly created', () => {
    const box = mapBox(box => box.set('name', 'test').set('playerId', '42'))();
    expect(box.name).toBe('test');
    expect(box.playerId).toBe('42');
    expect(box.partitions).toEqual(mapPartitions(identity)());
    expect(box.startedAt).toBeUndefined();
    expect(box.sessionFlashcards).toEqual(Stack<SessionFlashcard>());
    expect(box.sessionScore).toBe(0);
  });
});

describe('given a box named "test" and containing some flashcards in its first partition', () => {
  describe('when adding a new flashcard in partition 1', () => {
    test('then the partition 1 should now contain the new flashcard in addition to flashcards already present', () => {
      const flashcard = Flashcard({ question: 'some question 5', answer: 'some answer 5' });
      const box = mapBox(addFlashcard({ flashcard, partition: 1 }))(getBox());

      box.partitions.get(1);
      expect(box.partitions.get(1)).toEqual(OrderedSet<Flashcard>([flashcards[0], flashcards[1], flashcard]));
    });
  });

  describe('and today is 2019-04-01', () => {
    describe('when starting a session for the first time', () => {
      test('then the selected questions should contain questions from partition 2 and 1 according to the leitner schedule and the startedAt date and last session date should be set to 2019-04-01', () => {
        const box = startSession(dayjs('2019-04-01').toDate())(getBox());
        expect(box.sessionsPartitions).toEqual([2, 1]);
        expect(box.sessionFlashcards).toEqual(
          Stack<SessionFlashcard>([
            {
              flashcard: flashcards[2],
              fromPartition: 2,
            },
            {
              flashcard: flashcards[0],
              fromPartition: 1,
            },
            {
              flashcard: flashcards[1],
              fromPartition: 1,
            },
          ]),
        );
        expect(box.partitions.get(2).isEmpty()).toBeTruthy();
        expect(box.partitions.get(1).isEmpty()).toBeTruthy();
        expect(box.partitions.get(3).isEmpty()).toBeFalsy();
        expect(box.startedAt).toEqual(dayjs('2019-04-01').toDate());
        expect(box.lastStartedSessionDate).toEqual(dayjs('2019-04-01').toDate());
      });
      describe('and starting a session twice the same day', () => {
        test('then the selected questions should contain questions from partition 2 and 1 according to the leitner schedule and the startedAt date should be set to 2019-04-01', () => {
          const box = mapBox(
            startSession(dayjs('2019-04-01').toDate()),
            startSession(dayjs('2019-04-01').toDate()),
          )(getBox());
          expect(box.sessionsPartitions).toEqual([2, 1]);
          expect(box.sessionFlashcards).toEqual(
            Stack<SessionFlashcard>([
              {
                flashcard: flashcards[2],
                fromPartition: 2,
              },
              {
                flashcard: flashcards[0],
                fromPartition: 1,
              },
              {
                flashcard: flashcards[1],
                fromPartition: 1,
              },
            ]),
          );
          expect(box.partitions.get(2).isEmpty()).toBeTruthy();
          expect(box.partitions.get(1).isEmpty()).toBeTruthy();
          expect(box.partitions.get(3).isEmpty()).toBeFalsy();
        });
      });
    });
    describe('when starting a session 2 days in a row', () => {
      test('then the selected questions should contain questions from partition 2 and 1 according to the leitner schedule and the startedAt date should be 2019-04-01 and last session date should be set to 2019-04-02', () => {
        const box = mapBox(
          box =>
            box
              .set('startedAt', dayjs('2019-04-01').toDate())
              .set('lastStartedSessionDate', dayjs('2019-04-01').toDate()),
          startSession(dayjs('2019-04-02').toDate()),
        )(getBox());
        expect(box.sessionsPartitions).toEqual([3, 1]);
        expect(box.sessionFlashcards).toEqual(
          Stack<SessionFlashcard>([
            {
              flashcard: flashcards[3],
              fromPartition: 3,
            },
            {
              flashcard: flashcards[0],
              fromPartition: 1,
            },
            {
              flashcard: flashcards[1],
              fromPartition: 1,
            },
          ]),
        );
        expect(box.partitions.get(3).isEmpty()).toBeTruthy();
        expect(box.partitions.get(1).isEmpty()).toBeTruthy();
        expect(box.partitions.get(2).isEmpty()).toBeFalsy();
        expect(box.startedAt).toEqual(dayjs('2019-04-01').toDate());
        expect(box.lastStartedSessionDate).toEqual(dayjs('2019-04-02').toDate());
      });
    });
    describe('when starting a session (flashcards from partition [3,1]) while not having finished the last session (flashcards from partition [2,1])', () => {
      test('then the flashcards from partition 3 and 1 should correctly be added in session flashcards', () => {
        const box = mapBox(
          startSession(dayjs('2019-04-01').toDate()),
          startSession(dayjs('2019-04-02').toDate()),
        )(getBox());
        expect(box.sessionFlashcards.map(sessionFlashcard => sessionFlashcard.flashcard).toArray()).toEqual([
          flashcards[3],
          flashcards[0],
          flashcards[1],
        ]);
      });
    });
  });
});

describe('notifying a good answer', () => {
  describe('given a box where the current session score is 0 and the session deck contains 1 flashcard from partition 2 and 1 flashcard from partition 1, and the currently reviewing flashcard is the flashcard from partition 2', () => {
    describe('when notifying a good answer', () => {
      const getTestBox = (): Box =>
        mapBox(
          box =>
            box.set(
              'sessionFlashcards',
              Stack<SessionFlashcard>([
                {
                  flashcard: flashcards[2],
                  fromPartition: 2,
                },
                {
                  flashcard: flashcards[0],
                  fromPartition: 1,
                },
              ]),
            ),
          notifyGoodAnswer,
        )(getBox());
      test('then the box score should be 1', () => {
        const box = getTestBox();
        expect(box.sessionScore).toBe(1);
      });
      test('then the flashcard should be moved to the end of partition 3', () => {
        const box = getTestBox();
        expect(box.partitions.get(3).last()).toEqual(flashcards[2]);
      });
      test('then the new current flashcard to review should be the one from partition 1 at position 1', () => {
        const box = getTestBox();
        expect(box.sessionFlashcards.first()).toEqual({
          flashcard: flashcards[0],
          fromPartition: 1,
        });
      });
    });
  });
  describe('given a box where the session deck contains 1 flashcard from partition 7', () => {
    describe('when notifying a good answer', () => {
      const getTestBox = (): Box =>
        mapBox(
          box =>
            box.set(
              'sessionFlashcards',
              Stack<SessionFlashcard>([
                {
                  flashcard: flashcards[0],
                  fromPartition: 7,
                },
              ]),
            ),
          notifyGoodAnswer,
        )(getBox());
      test('then the flashcard should be archived', () => {
        const box = getTestBox();
        expect(box.archivedFlashcards).toContainEqual(flashcards[0]);
      });
    });
  });
});

describe('notifying a wrong answer', () => {
  describe('given a box where the current session score is 5 and the session deck contains 1 flashcard from partition 3 and 2 flashcards from partition 1, and the currently reviewing flashcard is the flashcard from partition 3', () => {
    describe('when notifying a wrong answer', () => {
      const getTestBox = (): Box =>
        mapBox(
          box =>
            box.set('sessionScore', 5).set(
              'sessionFlashcards',
              Stack<SessionFlashcard>([
                {
                  flashcard: flashcards[0],
                  fromPartition: 3,
                },
                {
                  flashcard: flashcards[1],
                  fromPartition: 1,
                },
                {
                  flashcard: flashcards[2],
                  fromPartition: 1,
                },
              ]),
            ),
          notifyWrongAnswer,
        )(getBox());
      test('then the box score should still be 5', () => {
        const box = getTestBox();
        expect(box.sessionScore).toBe(5);
      });
      test('then the flashcard should be moved back to the end of partition 1', () => {
        const box = getTestBox();
        expect(box.partitions.get(1).last()).toEqual(flashcards[1]);
      });
      test('then the new current flashcard to review should be the one from partition 1 at position 1', () => {
        const box = getTestBox();
        expect(box.sessionFlashcards.first()).toEqual({
          flashcard: flashcards[1],
          fromPartition: 1,
        });
      });
    });
  });
});
