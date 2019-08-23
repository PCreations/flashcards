import { GetBoxByNameAndPlayerId, SaveBox } from '../domain/box/repository';
import { Box, SessionFlashcard } from '../domain/box/box';
import { GetCurrentPlayerId } from '../domain/player/authentication';

type CurrentQuestionScreen = {
  boxName: string;
  sessionScore: number;
  totalFlashcardsToReview: number;
  currentFlashcardQuestion: string;
};

type CurrentQuestionScreenQuery = (
  getBoxByNameAndPlayerId: GetBoxByNameAndPlayerId,
) => (
  getCurrentPlayerId: GetCurrentPlayerId,
) => ({ boxName }: { boxName: Box['name'] }) => Promise<CurrentQuestionScreen>;

export const currentQuestionScreenQuery: CurrentQuestionScreenQuery = getBoxByNameAndPlayerId => getCurrentPlayerId => async ({
  boxName,
}) => {
  const box = await getBoxByNameAndPlayerId({
    boxName,
    playerId: getCurrentPlayerId(),
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
