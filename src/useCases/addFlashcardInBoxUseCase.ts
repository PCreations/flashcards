import { GetBoxByNameAndPlayerId, SaveBox } from '../domain/box/repository';
import { GetCurrentPlayerId } from '../domain/player/authentication';
import { addFlashcard, Box } from '../domain/box/box';
import { Flashcard } from '../domain/box/flashcard';

export type AddFlashcardInBoxUseCase = (
  getCurrentPlayerId: GetCurrentPlayerId,
) => (
  getBoxByNameAndPlayerId: GetBoxByNameAndPlayerId,
) => (
  saveBox: SaveBox,
) => ({ boxName, flashcard }: { boxName: string; flashcard: Flashcard }) => Promise<boolean>;

export const addFlashcardInBoxUseCase: AddFlashcardInBoxUseCase = getCurrentPlayerId => getBoxByNameAndPlayerId => saveBox => async ({
  boxName,
  flashcard,
}) => {
  const playerId = getCurrentPlayerId();
  const box =
    (await getBoxByNameAndPlayerId({
      boxName,
      playerId,
    })) || Box({ name: boxName, playerId });
  return saveBox(addFlashcard({ flashcard, partition: 1 })(box));
};
