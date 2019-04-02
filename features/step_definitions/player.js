const { Given, When } = require('cucumber');
const testDataCreators = require('../../tests/helpers/dataCreators');
const { AddFlashcardInBoxUseCase } = require('../../src/useCases/addFlashcardInBoxUseCase');
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

When('the current player wants to start the number {int} session in a row for the box {string}', function(
  nextSessionNumber,
  boxName,
) {
  return StartSessionUseCase().handle({ boxName, sessionNumber: nextSessionNumber });
});

Given('the current player has missed {int} sessions for the box {string}', function(int, boxName) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Given('the next session to be started is {int} for the box {string}', function(int, boxName) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

When('the current player selects the box {string}', function(string) {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});
