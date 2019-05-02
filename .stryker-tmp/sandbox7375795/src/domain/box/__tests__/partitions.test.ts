import { mapPartitions, addFlashcardInPartition, getPartitionsArray } from '../partitions';
import { Flashcard } from '../flashcard';

describe('partitions', () => {
  test('adding a flashcard in a partition should add this flashcard to the end of the partitions and give it a local id starting at 0 and incremented by 1 each time', () => {
    const flashcards = [
      Flashcard({ question: 'some question 1', answer: 'some answer 1' }),
      Flashcard({ question: 'some question 2', answer: 'some answer 2' }),
    ];
    const partitions = mapPartitions(
      addFlashcardInPartition({
        partition: 1,
        flashcard: flashcards[0],
      }),
      addFlashcardInPartition({
        partition: 1,
        flashcard: flashcards[1],
      }),
    )();
    expect(getPartitionsArray(partitions)[0]).toEqual(flashcards);
  });
});
