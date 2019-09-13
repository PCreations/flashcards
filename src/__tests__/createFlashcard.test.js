const { createFlashcard } = require('../createFlashcard');

describe('createFlashcard', () => {
  test('should accept an object with required not empty string properties "answer" and "question"', () => {
    expect(() => createFlashcard()).toThrowError('missing properties : "answer", "question"');
    expect(() => createFlashcard({ answer: '', question: '' })).toThrowError(
      'missing properties : "answer", "question"',
    );
    expect(() => createFlashcard({ answer: 'foo' })).toThrowError('missing properties : "question"');
    expect(() => createFlashcard({ answer: 'foo', question: 'bar' })).not.toThrow();
  });
  test('should return an immutable object', () => {
    const flashcard = createFlashcard({ answer: 'some answer', question: 'some question' });
    flashcard.answer = 'some other answer';
    expect(flashcard.answer).toBe('some answer');
  });
});
