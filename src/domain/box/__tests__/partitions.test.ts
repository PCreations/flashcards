import {
  addFlashcardInPartition,
  getPartitionsArray,
  createPartitions,
  moveFlashcardToItsNextPartition,
} from '../partitions';
import { createFlashcard, ofQuestion, withAnswer } from '../flashcard';

describe('partitions', () => {
  test('can be created empty', () => {
    const partitions = createPartitions();
    expect(getPartitionsArray(partitions)).toEqual([[], [], [], [], [], [], []]);
  });
  test('adding a flashcard in a partition should add this flashcard to the end of the partitions and give it a local id starting at 0 and incremented by 1 each time', () => {
    const partitions = createPartitions(
      addFlashcardInPartition({
        partition: 1,
        flashcard: createFlashcard(ofQuestion('some question 1'), withAnswer('some answer 1')),
      }),
      addFlashcardInPartition({
        partition: 1,
        flashcard: createFlashcard(ofQuestion('some question 2'), withAnswer('some answer 2')),
      }),
    );
    expect(getPartitionsArray(partitions)[0]).toEqual([
      {
        question: 'some question 1',
        answer: 'some answer 1',
      },
      {
        question: 'some question 2',
        answer: 'some answer 2',
      },
    ]);
  });
  test('a flashcard can be moved to the next partition if the next partition is not outside of the partitions boundary', () => {
    const flashcards = [
      createFlashcard(ofQuestion('some question 1'), withAnswer('some answer 1')),
      createFlashcard(ofQuestion('some question 2'), withAnswer('some answer 2')),
      createFlashcard(ofQuestion('some question 3'), withAnswer('some answer 3')),
    ];

    const initialPartitions = createPartitions(
      addFlashcardInPartition({
        partition: 1,
        flashcard: flashcards[0],
      }),
      addFlashcardInPartition({
        partition: 1,
        flashcard: flashcards[1],
      }),
      addFlashcardInPartition({
        partition: 2,
        flashcard: flashcards[2],
      }),
    );

    const updatedPartitions = moveFlashcardToItsNextPartition({ flashcard: flashcards[0] })(
      initialPartitions,
    );

    expect(getPartitionsArray(updatedPartitions).slice(0, 2)).toEqual([
      [flashcards[1]],
      [flashcards[2], flashcards[0]],
    ]);
  });
  test('a flashcard in the seventh partition can not be moved to the next partition', () => {
    const flashcards = [
      createFlashcard(ofQuestion('some question 1'), withAnswer('some answer 1')),
      createFlashcard(ofQuestion('some question 2'), withAnswer('some answer 2')),
      createFlashcard(ofQuestion('some question 3'), withAnswer('some answer 3')),
    ];

    const initialPartitions = createPartitions(
      addFlashcardInPartition({
        partition: 1,
        flashcard: flashcards[0],
      }),
      addFlashcardInPartition({
        partition: 1,
        flashcard: flashcards[1],
      }),
      addFlashcardInPartition({
        partition: 7,
        flashcard: flashcards[2],
      }),
    );

    expect(() =>
      moveFlashcardToItsNextPartition({ flashcard: flashcards[2] })(initialPartitions),
    ).toThrowError();
  });
});
