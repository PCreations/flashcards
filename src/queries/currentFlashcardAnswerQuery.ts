import { Flashcard } from '../domain/box/flashcard';
import { GetBoxByNameAndPlayerId } from '../domain/box/repository';
import { SessionFlashcard } from '../domain/box/box';

type CurrentFlashcardAnswerQuery = (
  getBoxByNameAndPlayerId: GetBoxByNameAndPlayerId,
) => ({ boxName, playerId }: { boxName: string; playerId: string }) => Promise<Flashcard['answer']>;

export const CurrentFlashcardAnswerQuery: CurrentFlashcardAnswerQuery = getBoxByNameAndPlayerId => async ({
  boxName,
  playerId,
}) => {
  const box = await getBoxByNameAndPlayerId({ boxName, playerId });
  const currentlyReviewedSessionFlashcard: SessionFlashcard = box.sessionFlashcards.first();
  return currentlyReviewedSessionFlashcard.flashcard.answer;
};
