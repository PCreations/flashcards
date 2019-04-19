import flow from 'lodash/fp/flow';

export type Flashcard = Readonly<{
  question?: string;
  answer?: string;
}>;

const mergeFlashcard = (updater: (flashcard: Flashcard) => Partial<Flashcard>) => (
  flashcard: Flashcard,
): Flashcard =>
  Object.freeze({
    ...flashcard,
    ...updater(flashcard),
  });

export const ofQuestion = (question: string) => mergeFlashcard(() => ({ question }));

export const withAnswer = (answer: string) => mergeFlashcard(() => ({ answer }));

export const createFlashcard = (...fns: ((flashcard: Flashcard) => Flashcard)[]): Flashcard =>
  flow(fns)(Object.freeze({}));
