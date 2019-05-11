import { BoxRepository } from '../domain/box/boxRepository';
import { Box, SessionFlashcard } from '../domain/box/box';
import { AuthenticationGateway } from '../domain/player/authenticationGateway';

type CurrentQuestionScreen = {
  boxName: string;
  sessionScore: number;
  totalFlashcardsToReview: number;
  currentFlashcardQuestion: string;
};

export const CurrentQuestionScreenQuery = ({
  boxRepository,
  authenticationGateway,
}: {
  boxRepository: BoxRepository;
  authenticationGateway: AuthenticationGateway;
}) => async ({ boxName }: { boxName: Box['name'] }): Promise<CurrentQuestionScreen> => {
  const box = await boxRepository.getBoxByName({
    boxName,
    playerId: authenticationGateway.getCurrentPlayer().id,
  });
  const totalFlashcardsToReview: number = box.sessionsPartitions.reduce(
    (total, partition) => total + box.partitions.get(partition).size,
    box.sessionFlashcards.size,
  );
  const currentFlashcardSessionToReview: SessionFlashcard = box.sessionFlashcards.first();
  return {
    boxName,
    sessionScore: box.sessionScore,
    currentFlashcardQuestion: currentFlashcardSessionToReview.flashcard.question,
    totalFlashcardsToReview,
  };
};
