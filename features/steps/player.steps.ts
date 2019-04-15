import { Given, When } from 'cucumber';
import dayjs from 'dayjs';
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
  return StartSessionUseCase(this.dependencies).handle({
    boxName: boxName,
    today: this.dependencies.dateService.getToday(),
  });
});

Given(
  /^the current player has started the box "([\w\W]*)" at ((?:\d{4})-(?:\d{2})-(?:\d{2}))$/,
  async function(boxName, startedAt) {
    const box = await this.dependencies.boxRepository.getBoxByName({
      boxName,
      playerId: this.dependencies.authenticationGateway.getCurrentPlayer().id,
    });

    return this.dependencies.boxRepository.save(box.whereFirstSessionStartedAt(dayjs(startedAt).toDate()));
  },
);

Given(
  /^the current player last played session for the box "([\w\W]*)" was at (?:never|((?:\d{4})-(?:\d{2})-(?:\d{2})))$/,
  async function(boxName, lastPlayedSessionStringDate) {
    if (typeof lastPlayedSessionStringDate === 'undefined') {
      return;
    }
    const { boxRepository, authenticationGateway } = this.dependencies;
    return StartSessionUseCase({
      boxRepository,
      authenticationGateway,
    }).handle({ boxName, today: dayjs(lastPlayedSessionStringDate).toDate() });
  },
);
