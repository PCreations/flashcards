const { Partition } = require('../partitions');
const { Flashcard } = require('../flashcard');

describe('Partition', () => {
  test('should be created with some flashcards', () => {
    const partition = Partition.ofFlashcards([
      Flashcard.ofQuestion('q1')
        .withAnswer('a1')
        .withId('1'),
      Flashcard.ofQuestion('q2')
        .withAnswer('a2')
        .withId('2'),
      Flashcard.ofQuestion('q3')
        .withAnswer('a3')
        .withId('3'),
    ]);
    expect(partition.flashcards.map(({ id, question, answer }) => ({ id, question, answer }))).toEqual([
      { id: '1', question: 'q1', answer: 'a1' },
      { id: '2', question: 'q2', answer: 'a2' },
      { id: '3', question: 'q3', answer: 'a3' },
    ]);
  });
});
