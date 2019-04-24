import { Given, When } from 'cucumber';
import dayjs from 'dayjs';
import { createFlashcardsFromGherkinDatatable } from '../../testsUtils/helpers/dataCreators';
import { AddFlashcardInBoxUseCase } from '../../src/useCases/addFlashcardInBoxUseCase';
import { StartSessionUseCase } from '../../src/useCases/startSessionUseCase';
import { whereFirstSessionStartedAt } from '../../src/domain/box/box';
import { NotifyAnswerUseCase } from '../../src/useCases/notifyAnswerUseCase';

When('the current player adds the following flashcard in his box named {string}:', function(
  boxName,
  flashcards,
) {
  const { boxRepository, authenticationGateway } = this.dependencies;
  return AddFlashcardInBoxUseCase({ boxRepository, authenticationGateway }).handle({
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

    return this.dependencies.boxRepository.save(whereFirstSessionStartedAt(dayjs(startedAt).toDate())(box));
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

When('the player reveals the answer of the current reviewed flashcard for the box {string}', function(
  boxName,
) {
  // Write code here that turns the phrase above into concrete actions
  return true;
});

When(
  /^the player notifies a (good|wrong) answer for the current reviewed flashcard for the box "([\w\W]*)"$/,
  function(answerType: 'good' | 'wrong', boxName) {
    const { boxRepository, authenticationGateway } = this.dependencies;
    const notifyAnswerUseCase = NotifyAnswerUseCase({ boxRepository, authenticationGateway });
    return notifyAnswerUseCase.handle({ boxName, didCorrectlyAnswer: answerType === 'good' });
  },
);
