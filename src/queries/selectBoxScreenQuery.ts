import { BoxRepository } from '../domain/box/boxRepository';
import { AuthenticationGateway } from '../domain/player/authenticationGateway';

type BoxScreen = {
  boxName: string;
  totalFlashcards: number;
  archivedFlashcards: number;
}[];

export const SelectBoxScreenQuery = ({
  boxRepository,
  authenticationGateway,
}: {
  boxRepository: BoxRepository;
  authenticationGateway: AuthenticationGateway;
}) => async (): Promise<BoxScreen> => {
  const boxes = await boxRepository.getAllBoxOwnedBy(authenticationGateway.getCurrentPlayer().id);
  return boxes.map(box => ({
    boxName: box.name,
    totalFlashcards:
      box.partitions.reduce((total, flashcards) => total + flashcards.size, 0) + box.archivedFlashcards.size,
    archivedFlashcards: box.archivedFlashcards.size,
  }));
};
