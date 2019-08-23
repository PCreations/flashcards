import { Flashcard } from '../domain/box/flashcard';
import { GetBoxByNameAndPlayerId } from '../domain/box/repository';

type SessionDeckQuery = (
  getBoxByNameAndPlayerId: GetBoxByNameAndPlayerId,
) => ({ boxName, playerId }: { boxName: string; playerId: string }) => Promise<Flashcard['question'][]>;

export const sessionDeckQuery: SessionDeckQuery = getBoxByNameAndPlayerId => async ({
  boxName,
  playerId,
}) => {
  const box = await getBoxByNameAndPlayerId({ boxName, playerId });

  return box.sessionFlashcards.map(sessionFlashcard => sessionFlashcard.flashcard.question).toArray();
};
