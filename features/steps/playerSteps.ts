import { DefineStepFunction } from 'jest-cucumber';
import dayjs from 'dayjs';
import { addFlashcardInBoxUseCase as createAddFlashcardInBoxUseCase } from '../../src/useCases/addFlashcardInBoxUseCase';
import { Flashcard } from '../../src/domain/box/flashcard';
import { startSessionUseCase as createStartSessionUseCase } from '../../src/useCases/startSessionUseCase';
import { notifyAnswerUseCase as createNotifyAnswerUseCase } from '../../src/useCases/notifyAnswerUseCase';
import { DependenciesContainer } from '../dependencies';

export const playerSteps = {
  'when the current player adds the following flashcard in his box named "(.*)":': (
    when: DefineStepFunction,
    depsContainer: DependenciesContainer,
  ) => {
    when(
      /^the current player adds the following flashcard in his box named "(.*)":$/,
      (boxName, flashcards) => {
        const {
          box: { getBoxByNameAndPlayerId, saveBox },
          player: { getCurrentPlayerId },
        } = depsContainer.dependencies;
        const addFlashcardUseCase = createAddFlashcardInBoxUseCase(getCurrentPlayerId)(
          getBoxByNameAndPlayerId,
        )(saveBox);
        return addFlashcardUseCase({ boxName, flashcard: Flashcard(flashcards[0]) });
      },
    );
  },
  'when the current player starts the session for the box "(.*)"': (
    when: DefineStepFunction,
    depsContainer: DependenciesContainer,
  ) => {
    when(/^the current player starts the session for the box "(.*)"$/, async boxName => {
      const {
        box: { getBoxByNameAndPlayerId, saveBox },
        player: { getCurrentPlayerId },
      } = depsContainer.dependencies;
      const startSessionUseCase = createStartSessionUseCase(getCurrentPlayerId)(getBoxByNameAndPlayerId)(
        saveBox,
      );
      return startSessionUseCase({
        boxName,
        today: depsContainer.dependencies.dateService.getToday(),
      });
    });
  },
  'and the current player has started the box "(.*)" at (date)': (
    and: DefineStepFunction,
    depsContainer: DependenciesContainer,
  ) => {
    and(
      /^the current player has started the box "(.*)" at ((?:\d{4})-(?:\d{2})-(?:\d{2}))$/,
      async (boxName, startedAtDate) => {
        const box = await depsContainer.dependencies.box.getBoxByNameAndPlayerId({
          boxName,
          playerId: depsContainer.dependencies.player.getCurrentPlayerId(),
        });
        await depsContainer.dependencies.box.saveBox(box.set('startedAt', dayjs(startedAtDate).toDate()));
      },
    );
  },
  'and the current player last played session for the box "(.*)" was at (date)': (
    and: DefineStepFunction,
    depsContainer: DependenciesContainer,
  ) => {
    and(
      /^the current player last played session for the box "(.*)" was at ((?:\d{4})-(?:\d{2})-(?:\d{2}))$/,
      async (boxName, lastPlayedSessionDate) => {
        if (typeof lastPlayedSessionDate === 'undefined') {
          return;
        }
        const {
          box: { getBoxByNameAndPlayerId, saveBox },
          player: { getCurrentPlayerId },
        } = depsContainer.dependencies;
        const startSessionUseCase = createStartSessionUseCase(getCurrentPlayerId)(getBoxByNameAndPlayerId)(
          saveBox,
        );
        return startSessionUseCase({
          boxName,
          today: dayjs(lastPlayedSessionDate).toDate(),
        });
      },
    );
  },
  'when the player notifies a (good|wrong) answer for the current reviewed flashcard for the box "(.*)"': (
    when: DefineStepFunction,
    depsContainer: DependenciesContainer,
  ) => {
    when(
      /^the player notifies a (good|wrong) answer for the current reviewed flashcard for the box "(.*)"$/,
      (answerType, boxName) => {
        const {
          box: { getBoxByNameAndPlayerId, saveBox },
          player: { getCurrentPlayerId },
        } = depsContainer.dependencies;
        const notifyAnswerUseCase = createNotifyAnswerUseCase(getCurrentPlayerId)(getBoxByNameAndPlayerId)(
          saveBox,
        );
        return notifyAnswerUseCase({ boxName, didCorrectlyAnswer: answerType === 'good' });
      },
    );
  },
};
