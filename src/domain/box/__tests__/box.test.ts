import { createBox } from '../../../../testsUtils/helpers/dataCreators';
import { flashcardsInDeck, flashcardsInPartitions } from '../../../../testsUtils/helpers/dataViews';
import { Flashcard } from '../flashcard';

describe('when creating an empty box named "test"', () => {
  test('the box should be correctly created', () => {
    const box = createBox({
      boxName: 'test',
      lastCompletedSession: 42,
      currentSession: 50,
    });
    expect(box.name).toBe('test');
    expect(box.partitions).toEqual({ 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] });
    expect(box.currentSession).toBe(50);
    expect(box.sessionDeck).toEqual([]);
    expect(box.lastCompletedSession).toEqual(42);
  });
});

describe('when creating an empty box named "test"', () => {
  test('the box next session should be 1', () => {
    const box = createBox({
      boxName: 'test',
    });
    expect(box.currentSession).toBe(1);
  });
  test('the box last completed session should be 0', () => {
    const box = createBox({
      boxName: 'test',
    });
    expect(box.lastCompletedSession).toBe(0);
  });
});

describe('when creating a box named "test" and containing some flashcards in its partitions 1, 2 and 3 with next session being session 42', () => {
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
          {
            id: 'mno',
            question: 'some question 5',
            answer: 'some answer 5',
          },
        ],
      ],
      currentSession: 42,
      lastCompletedSession: 41,
    });
  test('the box next session should be 42', () => {
    const box = getBox();
    expect(box.name).toBe('test');
    expect(box.currentSession).toBe(42);
  });
  describe('given the leitner schedule says that the session deck should contain flashcards from partition 1 and 3 for session 42', () => {
    test('then the box deck should contain flashcards from its partition 1 and 3', () => {
      const box = getBox();
      expect(flashcardsInDeck({ deck: box.sessionDeck })).toEqual([
        {
          id: 'jkl',
          question: 'some question 4',
          answer: 'some answer 4',
        },
        {
          id: 'mno',
          question: 'some question 5',
          answer: 'some answer 5',
        },
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
    describe('and given the last completed session was session 40', () => {
      /*test('then the flashcards scheduled for session 41 (2 and 1) should also be included in the session deck', () => {
        const box = getBox().withLastCompletedSessionBeing(40);
        expect(flashcardsInDeck({ deck: box.sessionDeck })).toEqual([
          {
            id: 'jkl',
            question: 'some question 4',
            answer: 'some answer 4',
          },
          {
            id: 'mno',
            question: 'some question 5',
            answer: 'some answer 5',
          },
          {
            id: 'ghi',
            question: 'some question 3',
            answer: 'some answer 3',
          },
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
      });*/
    });
  });
});

describe('when creating a box named "test" and containing some flashcards', () => {
  test('the box should be correctly created', () => {
    const box = createBox({
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
    expect(flashcardsInPartitions({ box, partitions: [1, 3] })).toEqual([
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
      const box = createBox({
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
          id: 'ghi',
          question: 'some question 3',
          answer: 'some answer 3',
        },
      ]);
    });
  });
});
