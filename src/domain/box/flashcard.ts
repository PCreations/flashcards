import { Record } from 'immutable';

type FlashcardProps = {
  question?: string;
  answer?: string;
};

export const Flashcard = Record<FlashcardProps>({
  question: undefined,
  answer: undefined,
});

export type Flashcard = ReturnType<typeof Flashcard>;
