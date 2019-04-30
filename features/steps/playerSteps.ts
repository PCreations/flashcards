import { DefineStepFunction } from 'jest-cucumber';
import dayjs from 'dayjs';
import { AuthenticationGateway } from '../../src/adapters/inMemory/authenticationGateway';
import { BoxRepository } from '../../src/adapters/inMemory/boxRepository';
import { AddFlashcardInBoxUseCase } from '../../src/useCases/addFlashcardInBoxUseCase';
import { Flashcard } from '../../src/domain/box/flashcard';
import { StartSessionUseCase } from '../../src/useCases/startSessionUseCase';
import { DateService } from '../../src/domain/box/dateService';
import { NotifyAnswerUseCase } from '../../src/useCases/notifyAnswerUseCase';
import { DependenciesContainer } from '../dependencies';

export const playerSteps = {
  'when the current player adds the following flashcard in his box named "(.*)":': (
    when: DefineStepFunction,
    depsContainer: DependenciesContainer,
  ) => {
    when(
      /^the current player adds the following flashcard in his box named "(.*)":$/,
      (boxName, flashcards) => {
        const { boxRepository, authenticationGateway } = depsContainer.dependencies;
        const addFlashcardUseCase = AddFlashcardInBoxUseCase({ boxRepository, authenticationGateway });
        return addFlashcardUseCase.handle({ boxName, flashcard: Flashcard(flashcards[0]) });
      },
    );
  },
  'when the current player starts the session for the box "(.*)"': (
    when: DefineStepFunction,
    depsContainer: DependenciesContainer
  ) => {
    when(/^the current player starts the session for the box "(.*)"$/, async boxName =>
      StartSessionUseCase(depsContainer.dependencies).handle({
        boxName,
        today: depsContainer.dependencies.dateService.getToday(),
      }),
    );
  },
  'and the current player has started the box "(.*)" at (date)': (
    and: DefineStepFunction,
    depsContainer: DependenciesContainer
  ) => {
    and(
      /^the current player has started the box "(.*)" at ((?:\d{4})-(?:\d{2})-(?:\d{2}))$/,
      async (boxName, startedAtDate) => {
        const box = await depsContainer.dependencies.boxRepository.getBoxByName({
          boxName,
          playerId: depsContainer.dependencies.authenticationGateway.getCurrentPlayer().id,
        });
        return depsContainer.dependencies.boxRepository.save(box.set('startedAt', dayjs(startedAtDate).toDate()));
      },
    );
  },
  'and the current player last played session for the box "(.*)" was at (date)': (
    and: DefineStepFunction,
    depsContainer: DependenciesContainer
  ) => {
    and(
      /^the current player last played session for the box "(.*)" was at ((?:\d{4})-(?:\d{2})-(?:\d{2}))$/,
      async (boxName, lastPlayedSessionDate) => {
        if (typeof lastPlayedSessionDate === 'undefined') {
          return;
        }
        const { boxRepository, authenticationGateway } = depsContainer.dependencies;
        return StartSessionUseCase({
          boxRepository,
          authenticationGateway,
        }).handle({ boxName, today: dayjs(lastPlayedSessionDate).toDate() });
      },
    );
  },
  'when the player notifies a (good|wrong) answer for the current reviewed flashcard for the box "(.*)"': (
    when: DefineStepFunction,
    depsContainer: DependenciesContainer
  ) => {
    when(/^the player notifies a (good|wrong) answer for the current reviewed flashcard for the box "(.*)"$/, (answerType, boxName) => {
      const { boxRepository, authenticationGateway } = depsContainer.dependencies;
      const notifyAnswerUseCase = NotifyAnswerUseCase({ boxRepository, authenticationGateway });
      return notifyAnswerUseCase.handle({ boxName, didCorrectlyAnswer: answerType === 'good' });
    });
  }
};
