import { Flashcard } from '../flashcard';

describe('when creating a flashcard of id "42" with the question "some question ?" and the answer "some answer"', () => {
  test('then the flashcard should be correctly created', () => {
    const flashcard = Flashcard.ofQuestion('some question')
      .withAnswer('some answer')
      .withId('42');
    expect(flashcard.question).toBe('some question');
    expect(flashcard.answer).toBe('some answer');
    expect(flashcard.id).toBe('42');
  });
});

describe('when creating a flashcard of id "43" with the question "some other question ?" and the answer "some other answer"', () => {
  test('then the flashcard should be correctly created', () => {
    const flashcard = Flashcard.ofQuestion('some other question')
      .withAnswer('some other answer')
      .withId('43');
    expect(flashcard.question).toBe('some other question');
    expect(flashcard.answer).toBe('some other answer');
    expect(flashcard.id).toBe('43');
  });
});
