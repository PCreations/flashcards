const { BoxRepository } = require('../domain/box/boxRepository');
const { FlashcardIdentityService } = require('../domain/box/flashcardIdentityService');
const { AuthenticationGateway } = require('../domain/player/authenticationGateway');
const { Flashcard } = require('../domain/box/flashcard');
const { Box } = require('../domain/box/box');
const { Player } = require('../domain/player/player');

const AddFlashcardInBoxUseCase = ({
  boxRepository = BoxRepository(),
  authenticationGateway = AuthenticationGateway(),
  flashcardIdentityService = FlashcardIdentityService(),
} = {}) => ({
  async handle({ boxName = String(), flashcard = Flashcard } = {}) {
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

module.exports = {
  AddFlashcardInBoxUseCase,
};
