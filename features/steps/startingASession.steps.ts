import { loadFeature, defineFeature, DefineStepFunction } from 'jest-cucumber';
import dayjs from 'dayjs';
import { boxSteps } from './boxSteps';
import { playerSteps } from './playerSteps';
import { sessionDeckSteps } from './sessionDeckSteps';
import { DateService } from '../../src/domain/box/dateService';
import { BoxRepository } from '../../src/adapters/inMemory/boxRepository';
import { AuthenticationGateway } from '../../src/adapters/inMemory/authenticationGateway';
import { Player } from '../../src/domain/player/player';
import { Box } from '../../src/domain/box/box';
import { CurrentFlashcardQuestionQuery } from '../../src/queries/currentFlashcardQuestionQuery';

const feature = loadFeature('./features/startingASession.feature');

const dateSteps = {
  'and today is (date)': (and: DefineStepFunction, dependencies: { dateService: DateService }) => {
    and(/^today is ((?:\d{4})-(?:\d{2})-(?:\d{2}))$/, date => {
      dependencies.dateService = DateService({ getToday: () => dayjs(date).toDate() });
    });
  },
};

defineFeature(feature, test => {
  let theBoxBeforeHavingStartedTheSession: Box;
  const dependencies = (() => {
    let boxRepository: BoxRepository;
    let authenticationGateway: AuthenticationGateway;
    let dateService: DateService;
    return {
      get boxRepository() {
        return boxRepository;
      },
      get authenticationGateway() {
        return authenticationGateway;
      },
      get dateService() {
        return dateService;
      },
      set boxRepository(theBoxRepository) {
        boxRepository = theBoxRepository;
      },
      set authenticationGateway(theAuthenticationGateway) {
        authenticationGateway = theAuthenticationGateway;
      },
      set dateService(theDateService) {
        dateService = theDateService;
      },
    };
  })();

  beforeEach(() => {
    dependencies.boxRepository = BoxRepository();
    dependencies.authenticationGateway = AuthenticationGateway();
    return dependencies.authenticationGateway.authenticate(Player({ id: '42' }));
  });
  test('The current player has never played the box "Capitals of the World"', ({
    given,
    when,
    then,
    and,
  }) => {
    boxSteps['given a box named "(.*)" containing the following flashcards:'](given, dependencies, box => {
      theBoxBeforeHavingStartedTheSession = box;
    });
    dateSteps['and today is (date)'](and, dependencies);
    playerSteps['when the current player starts the session for the box "(.*)"'](when, dependencies);
    sessionDeckSteps[
      'then the session deck for the box "(.*)" should contain flashcards questions from partitions (.*)'
    ](() => theBoxBeforeHavingStartedTheSession, then, dependencies);

    and(
      /^the flashcard question to review for the box "(.*)" should be "(.*)"$/,
      async (boxName, expectedQuestion) => {
        const { authenticationGateway, boxRepository } = dependencies;
        const currentFlashcardQuestionQuery = CurrentFlashcardQuestionQuery({ boxRepository });
        const actualQuestion = await currentFlashcardQuestionQuery.execute({
          boxName,
          playerId: authenticationGateway.getCurrentPlayer().id,
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
    boxSteps['given a box named "(.*)" containing the following flashcards:'](given, dependencies, box => {
      theBoxBeforeHavingStartedTheSession = box;
    });

    dateSteps['and today is (date)'](and, dependencies);

    playerSteps['and the current player has started the box "(.*)" at (date)'](and, dependencies);

    playerSteps['and the current player last played session for the box "(.*)" was at (date)'](
      and,
      dependencies,
    );

    playerSteps['when the current player starts the session for the box "(.*)"'](when, dependencies);

    playerSteps['when the current player starts the session for the box "(.*)"'](when, dependencies);

    sessionDeckSteps[
      'then the session deck for the box "(.*)" should contain flashcards questions from partitions (.*)'
    ](() => theBoxBeforeHavingStartedTheSession, then, dependencies);
  });

  test('The current player starts a session the <todaySessionDate> while the last session was played at <lastPlayedAt> for his box "Capitals of the World" started on 2019-04-01', ({
    given,
    and,
    when,
    then,
  }) => {
    boxSteps['given a box named "(.*)" containing the following flashcards:'](given, dependencies, box => {
      theBoxBeforeHavingStartedTheSession = box;
    });

    dateSteps['and today is (date)'](and, dependencies);

    playerSteps['and the current player has started the box "(.*)" at (date)'](and, dependencies);

    playerSteps['and the current player last played session for the box "(.*)" was at (date)'](
      and,
      dependencies,
    );

    playerSteps['when the current player starts the session for the box "(.*)"'](when, dependencies);

    sessionDeckSteps[
      'then the session deck for the box "(.*)" should contain flashcards questions from partitions (.*)'
    ](() => theBoxBeforeHavingStartedTheSession, then, dependencies);
  });

  test('The current player starts a session the <todaySessionDate> and hasn\'t missed the previous session for his box "Capitals of the World" started on 2019-04-01', ({
    given,
    and,
    when,
    then,
  }) => {
    boxSteps['given a box named "(.*)" containing the following flashcards:'](given, dependencies, box => {
      theBoxBeforeHavingStartedTheSession = box;
    });

    dateSteps['and today is (date)'](and, dependencies);

    playerSteps['and the current player has started the box "(.*)" at (date)'](and, dependencies);

    playerSteps['and the current player last played session for the box "(.*)" was at (date)'](
      and,
      dependencies,
    );

    playerSteps['when the current player starts the session for the box "(.*)"'](when, dependencies);

    sessionDeckSteps[
      'then the session deck for the box "(.*)" should contain flashcards questions from partitions (.*)'
    ](() => theBoxBeforeHavingStartedTheSession, then, dependencies);
  });
});
