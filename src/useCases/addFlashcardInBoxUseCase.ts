import { BoxRepository } from '../domain/box/boxRepository';
import { FlashcardIdentityService } from '../domain/box/flashcardIdentityService';
import { AuthenticationGateway } from '../domain/player/authenticationGateway';
import { Flashcard } from '../domain/box/flashcard';
import { Box } from '../domain/box/box';
import { Player } from '../domain/player/player';

export const AddFlashcardInBoxUseCase = ({
  boxRepository,
  authenticationGateway,
  flashcardIdentityService,
}: {
  boxRepository: BoxRepository;
  authenticationGateway: AuthenticationGateway;
  flashcardIdentityService: FlashcardIdentityService;
}) => ({
  async handle({ boxName, flashcard }: { boxName: string; flashcard: Flashcard }) {
    const playerId = authenticationGateway.getCurrentPlayer().id;
    const box =
      (await boxRepository.getBoxByName({
        boxName,
        playerId,
      })) || Box.named(boxName).ownedBy(Player.ofId(playerId));
    return boxRepository.save(
      box.addFlashcard(flashcard.withId(flashcardIdentityService.getNextFlashcardId())).inPartition(1),
    );
  },
});

export type AddFlashcardInBoxUseCase = ReturnType<typeof AddFlashcardInBoxUseCase>;
