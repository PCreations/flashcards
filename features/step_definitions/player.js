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

When('the current player starts the session {int} for the box {string}', function(
  nextSessionNumber,
  boxName,
) {
  return StartSessionUseCase().handle({ boxName, sessionNumber: nextSessionNumber });
});

Given('the current player has missed {int} sessions for the box {string}', function(int, boxName) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});
