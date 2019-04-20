import { BoxRepository } from '../domain/box/boxRepository';
import { createBox, named, ownedBy, addFlashcard } from '../domain/box/box';
import { AuthenticationGateway } from '../domain/player/authenticationGateway';
import { Flashcard } from '../domain/box/flashcard';
import { Player } from '../domain/player/player';

export const AddFlashcardInBoxUseCase = ({
  boxRepository,
  authenticationGateway,
}: {
  boxRepository: BoxRepository;
  authenticationGateway: AuthenticationGateway;
}) => ({
  async handle({ boxName, flashcard }: { boxName: string; flashcard: Flashcard }) {
    const playerId = authenticationGateway.getCurrentPlayer().id;
    const box =
      (await boxRepository.getBoxByName({
        boxName,
        playerId,
      })) || createBox(named(boxName), ownedBy(Player.ofId(playerId)));
    return boxRepository.save(addFlashcard({ flashcard, partition: 1 })(box));
  },
});

export type AddFlashcardInBoxUseCase = ReturnType<typeof AddFlashcardInBoxUseCase>;