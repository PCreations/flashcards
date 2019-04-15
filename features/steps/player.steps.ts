import { Given, When } from 'cucumber';
import { createFlashcardsFromGherkinDatatable } from '../../testsUtils/helpers/dataCreators';
import { AddFlashcardInBoxUseCase } from '../../src/useCases/addFlashcardInBoxUseCase';
import { StartSessionUseCase } from '../../src/useCases/startSessionUseCase';
import { FlashcardIdentityService } from '../../src/domain/box/flashcardIdentityService';

When('the current player adds the following flashcard in his box named {string}:', function(
  boxName,
  flashcards,
) {
  const { boxRepository, authenticationGateway } = this.dependencies;
  const flashcardIdentityService = FlashcardIdentityService({
    getNextFlashcardId() {
      return 'ghi';
    },
  });
  return AddFlashcardInBoxUseCase({ boxRepository, authenticationGateway, flashcardIdentityService }).handle({
    boxName,
    flashcard: createFlashcardsFromGherkinDatatable(flashcards)[0],
  });
});

When('the current player starts the session for the box {string}', function(boxName) {
  return 'pending';
  //return StartSessionUseCase().handle();
});

Given(
  /^the current player last played session for the box "([\w\W]*)" was at (?:never|(?:(\d{4})-(\d{2})-(\d{2})))$/,
  async function(boxName, lastSessionYear, lastSessionMonth, lastSessionDay) {
    /*const { boxRepository, authenticationGateway } = this.dependencies;
  const box = await boxRepository.getBoxByName({
    boxName,
    playerId: authenticationGateway.getCurrentPlayer().id,
  });
  return boxRepository.save(box.withLastCompletedSessionBeing(lastCompletedSession));*/
    return 'pending';
  },
);
