import { Flashcard } from '../domain/box/flashcard';
import { GetBoxByNameAndPlayerId } from '../domain/box/repository';
import { SessionFlashcard } from '../domain/box/box';

type CurrentFlashcardQuestionQuery = (
  getBoxByNameAndPlayerId: GetBoxByNameAndPlayerId,
) => ({ boxName, playerId }: { boxName: string; playerId: string }) => Promise<Flashcard['question']>;

export const currentFlashcardQuestionQuery: CurrentFlashcardQuestionQuery = getBoxByNameAndPlayerId => async ({
  boxName,
  playerId,
}) => {
  const box = await getBoxByNameAndPlayerId({ boxName, playerId });
  const currentlyReviewedSessionFlashcard: SessionFlashcard = box.sessionFlashcards.first();
  return currentlyReviewedSessionFlashcard.flashcard.question;
};
