import { Box, getTotalNumberOfFlashcards } from '../domain/box/box';
import { GetBoxByNameAndPlayerId } from '../domain/box/repository';
import { GetCurrentPlayerId } from '../domain/player/authentication';

type SessionPreviewScreen = {
  boxName: string;
  totalFlashcards: number;
  archivedFlashcards: number;
  numberOfFlashcardsToReviewRoday: number;
};

type SessionPreviewScreenQuery = (
  getBoxByNameAndPlayerId: GetBoxByNameAndPlayerId,
) => (
  getCurrentPlayerId: GetCurrentPlayerId,
) => ({ boxName }: { boxName: Box['name'] }) => Promise<SessionPreviewScreen>;

export const sessionPreviewScreenQuery: SessionPreviewScreenQuery = getBoxByNameAndPlayerId => getCurrentPlayerId => async ({
  boxName,
}: {
  boxName: Box['name'];
}): Promise<SessionPreviewScreen> => {
  const box = await getBoxByNameAndPlayerId({
    boxName,
    playerId: getCurrentPlayerId(),
  });
  return {
    boxName,
    totalFlashcards: getTotalNumberOfFlashcards(box),
    archivedFlashcards: box.archivedFlashcards.size,
    numberOfFlashcardsToReviewRoday: box.sessionFlashcards.size,
  };
};
