import { getTotalNumberOfFlashcards } from '../domain/box/box';
import { GetAllBoxesOwnedBy } from '../domain/box/repository';
import { GetCurrentPlayerId } from '../domain/player/authentication';

type BoxScreen = {
  boxName: string;
  totalFlashcards: number;
  archivedFlashcards: number;
}[];

type SelectBoxScreenQuery = (
  getAllBoxesOwnedBy: GetAllBoxesOwnedBy,
) => (getCurrentPlayerId: GetCurrentPlayerId) => () => Promise<BoxScreen>;

export const selectBoxScreenQuery: SelectBoxScreenQuery = getAllBoxesOwnedBy => getCurrentPlayerId => async (): Promise<
  BoxScreen
> => {
  const boxes = await getAllBoxesOwnedBy(getCurrentPlayerId());
  return boxes.map(box => ({
    boxName: box.name,
    totalFlashcards: getTotalNumberOfFlashcards(box),
    archivedFlashcards: box.archivedFlashcards.size,
  }));
};
