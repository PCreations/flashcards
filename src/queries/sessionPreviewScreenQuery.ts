import { BoxRepository } from '../domain/box/boxRepository';
import { Box, getTotalNumberOfFlashcards } from '../domain/box/box';
import { AuthenticationGateway } from '../domain/player/authenticationGateway';

type SessionPreviewScreen = {
  boxName: string;
  totalFlashcards: number;
  archivedFlashcards: number;
  numberOfFlashcardsToReviewRoday: number;
};

export const SessionPreviewScreenQuery = ({
  boxRepository,
  authenticationGateway,
}: {
  boxRepository: BoxRepository;
  authenticationGateway: AuthenticationGateway;
}) => async ({ boxName }: { boxName: Box['name'] }): Promise<SessionPreviewScreen> => {
  const box = await boxRepository.getBoxByName({
    boxName,
    playerId: authenticationGateway.getCurrentPlayer().id,
  });
  return {
    boxName,
    totalFlashcards: getTotalNumberOfFlashcards(box),
    archivedFlashcards: box.archivedFlashcards.size,
    numberOfFlashcardsToReviewRoday: box.sessionFlashcards.size,
  };
};
