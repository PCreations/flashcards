import { loadFeature, defineFeature, DefineStepFunction } from 'jest-cucumber';
import dayjs from 'dayjs';
import { boxSteps } from './boxSteps';
import { playerSteps } from './playerSteps';
import { sessionDeckSteps } from './sessionDeckSteps';
import { DateService } from '../../src/domain/box/dateService';
import { Player } from '../../src/domain/player/player';
import { Box } from '../../src/domain/box/box';
import { currentFlashcardQuestionQuery as createCurrentFlashcardQuestionQuery } from '../../src/queries/currentFlashcardQuestionQuery';
import { createDepsContainer, DependenciesContainer } from '../dependencies';

const feature = loadFeature('./features/startingASession.feature');

const dateSteps = {
  'and today is (date)': (and: DefineStepFunction, depsContainer: DependenciesContainer) => {
    and(/^today is ((?:\d{4})-(?:\d{2})-(?:\d{2}))$/, date => {
      depsContainer.dependencies.dateService = DateService({ getToday: () => dayjs(date).toDate() });
    });
  },
};

defineFeature(feature, test => {
  let theBoxBeforeHavingStartedTheSession: Box;
  const depsContainer = createDepsContainer();

  beforeEach(async () => {
    await depsContainer.loadDependencies();
    return depsContainer.dependencies.player.authenticate(Player({ id: '42' }));
  });

  test('The current player has never played the box "Capitals of the World"', ({
    given,
    when,
    then,
    and,
  }) => {
    boxSteps['given a box named "(.*)" containing the following flashcards:'](given, depsContainer, box => {
      theBoxBeforeHavingStartedTheSession = box;
    });
    dateSteps['and today is (date)'](and, depsContainer);
    playerSteps['when the current player starts the session for the box "(.*)"'](when, depsContainer);
    sessionDeckSteps[
      'then the session deck for the box "(.*)" should contain flashcards questions from partitions (.*)'
    ](() => theBoxBeforeHavingStartedTheSession, then, depsContainer);

    and(
      /^the flashcard question to review for the box "(.*)" should be "(.*)"$/,
      async (boxName, expectedQuestion) => {
        const {
          box: { getBoxByNameAndPlayerId },
          player: { getCurrentPlayerId },
        } = depsContainer.dependencies;
        const currentFlashcardQuestionQuery = createCurrentFlashcardQuestionQuery(getBoxByNameAndPlayerId);
        const actualQuestion = await currentFlashcardQuestionQuery({
          boxName,
          playerId: getCurrentPlayerId(),
        });
        expect(actualQuestion).toEqual(expectedQuestion);
      },
    );
  });

  test('The current player wants to play tow times the same day the box "Capitals of the World" that he has already played before', ({
    given,
    and,
    when,
    then,
  }) => {
    boxSteps['given a box named "(.*)" containing the following flashcards:'](given, depsContainer, box => {
      theBoxBeforeHavingStartedTheSession = box;
    });

    dateSteps['and today is (date)'](and, depsContainer);

    playerSteps['and the current player has started the box "(.*)" at (date)'](and, depsContainer);

    playerSteps['and the current player last played session for the box "(.*)" was at (date)'](
      and,
      depsContainer,
    );

    playerSteps['when the current player starts the session for the box "(.*)"'](when, depsContainer);

    playerSteps['when the current player starts the session for the box "(.*)"'](when, depsContainer);

    sessionDeckSteps[
      'then the session deck for the box "(.*)" should contain flashcards questions from partitions (.*)'
    ](() => theBoxBeforeHavingStartedTheSession, then, depsContainer);
  });

  test('The current player starts a session the <todaySessionDate> while the last session was played at <lastPlayedAt> for his box "Capitals of the World" started on 2019-04-01', ({
    given,
    and,
    when,
    then,
  }) => {
    boxSteps['given a box named "(.*)" containing the following flashcards:'](given, depsContainer, box => {
      theBoxBeforeHavingStartedTheSession = box;
    });

    dateSteps['and today is (date)'](and, depsContainer);

    playerSteps['and the current player has started the box "(.*)" at (date)'](and, depsContainer);

    playerSteps['and the current player last played session for the box "(.*)" was at (date)'](
      and,
      depsContainer,
    );

    playerSteps['when the current player starts the session for the box "(.*)"'](when, depsContainer);

    sessionDeckSteps[
      'then the session deck for the box "(.*)" should contain flashcards questions from partitions (.*)'
    ](() => theBoxBeforeHavingStartedTheSession, then, depsContainer);
  });

  test('The current player starts a session the <todaySessionDate> and hasn\'t missed the previous session for his box "Capitals of the World" started on 2019-04-01', ({
    given,
    and,
    when,
    then,
  }) => {
    boxSteps['given a box named "(.*)" containing the following flashcards:'](given, depsContainer, box => {
      theBoxBeforeHavingStartedTheSession = box;
    });

    dateSteps['and today is (date)'](and, depsContainer);

    playerSteps['and the current player has started the box "(.*)" at (date)'](and, depsContainer);

    playerSteps['and the current player last played session for the box "(.*)" was at (date)'](
      and,
      depsContainer,
    );

    playerSteps['when the current player starts the session for the box "(.*)"'](when, depsContainer);

    sessionDeckSteps[
      'then the session deck for the box "(.*)" should contain flashcards questions from partitions (.*)'
    ](() => theBoxBeforeHavingStartedTheSession, then, depsContainer);
  });
});
