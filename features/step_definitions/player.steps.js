const { Given, When } = require('cucumber');
const testDataCreators = require('../../tests/helpers/dataCreators');
const { AddFlashcardInBoxUseCase } = require('../../src/useCases/addFlashcardInBoxUseCase');
const { StartSessionUseCase } = require('../../src/useCases/startSessionUseCase');
const { FlashcardIdentityService } = require('../../src/domain/box/flashcardIdentityService');
const { getDependencies } = require('../getDependencies');

When('the current player adds the following flashcard in his box named {string}:', function(
  boxName,
  flashcards,
) {
  const { boxRepository, authenticationGateway } = getDependencies(this);
  const flashcardIdentityService = FlashcardIdentityService({
    getNextFlashcardId() {
      return 'ghi';
    },
  });
  return AddFlashcardInBoxUseCase({ boxRepository, authenticationGateway, flashcardIdentityService }).handle({
    boxName,
    flashcard: testDataCreators.createFlashcardsFromGherkinDatatable(flashcards)[0],
  });
});

When('the current player starts the session for the box {string}', function(boxName) {
  return StartSessionUseCase().handle({ boxName });
});

Given('the current player last completed session was {int} for the box {string}', async function(
  lastCompletedSession,
  boxName,
) {
  const { boxRepository, authenticationGateway } = getDependencies(this);
  const box = await boxRepository.getBoxByName({
    boxName,
    playerId: authenticationGateway.getCurrentPlayer().id,
  });
  return boxRepository.save(box.withLastCompletedSessionBeing(lastCompletedSession));
});
