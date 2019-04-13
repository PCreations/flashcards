const FlashcardFactory = (data: { id?: string; answer?: string; question?: string } = {}) =>
  Object.freeze({
    ofQuestion(question: string) {
      return FlashcardFactory({ ...data, question });
    },
    withAnswer(answer: string) {
      return FlashcardFactory({ ...data, answer });
    },
    withId(id: string) {
      return FlashcardFactory({ ...data, id });
    },
    ...data,
  });

export const Flashcard = FlashcardFactory();

export type Flashcard = ReturnType<typeof FlashcardFactory>;
