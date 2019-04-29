import { loadFeature, defineFeature } from 'jest-cucumber';
import { boxSteps } from './boxSteps';
import { BoxRepository } from '../../src/adapters/inMemory/boxRepository';
import { AuthenticationGateway } from '../../src/adapters/inMemory/authenticationGateway';
import { Player } from '../../src/domain/player/player';
import { Box, SessionFlashcard } from '../../src/domain/box/box';
import { DateService } from '../../src/domain/box/dateService';
import { sessionDeckSteps } from './sessionDeckSteps';
import { playerSteps } from './playerSteps';

const feature = loadFeature('./features/notifyingAnswer.feature');

defineFeature(feature, test => {
  let theBoxBeforeHavingStartedTheSession: Box;
  let currentlyReviewedFlashcard: SessionFlashcard;
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
  test('The player notifies a good answer for a card from the second partition', ({ given, and, when, then }) => {
    boxSteps['given a box named "(.*)" containing the following flashcards:'](given, dependencies, box => {
      theBoxBeforeHavingStartedTheSession = box;
    });

    sessionDeckSteps["and the flashcards to review for the current session of the box \"(.*)\" are taken from partitions \"(.*)\""](and, dependencies, (theCurrentlyReviewedFlashcard) => {
      currentlyReviewedFlashcard = theCurrentlyReviewedFlashcard;
    })

    sessionDeckSteps["and the flashcard question to review for the box \"Capitals of the World\" is \"(.*)\""](() => currentlyReviewedFlashcard, and);

    boxSteps["and the current score for the box \"(.*)\" is (d*)"](and, dependencies);

    playerSteps["when the player notifies a (good|wrong) answer for the current reviewed flashcard for the box \"(.*)\""](when, dependencies);

    boxSteps["then the current score for the box \"(.*)\" should be (d*)"](then, dependencies);

    sessionDeckSteps["and the currently reviewed flashcard for the box \"(.*)\" should now be at the end of the partition (d)"](() => currentlyReviewedFlashcard, and, dependencies);

    sessionDeckSteps["and the flashcard question to review for the box \"(.*)\" should be \"(.*)\""](and, dependencies)
  });

  test('The player notifies a wrong answer for a card from the second partition', ({ given, and, when, then }) => {
    boxSteps['given a box named "(.*)" containing the following flashcards:'](given, dependencies, box => {
      theBoxBeforeHavingStartedTheSession = box;
    });

    sessionDeckSteps["and the flashcards to review for the current session of the box \"(.*)\" are taken from partitions \"(.*)\""](and, dependencies, (theCurrentlyReviewedFlashcard) => {
      currentlyReviewedFlashcard = theCurrentlyReviewedFlashcard;
    })

    sessionDeckSteps["and the flashcard question to review for the box \"Capitals of the World\" is \"(.*)\""](() => currentlyReviewedFlashcard, and);

    boxSteps["and the current score for the box \"(.*)\" is (d*)"](and, dependencies);

    playerSteps["when the player notifies a (good|wrong) answer for the current reviewed flashcard for the box \"(.*)\""](when, dependencies);

    boxSteps["then the current score for the box \"(.*)\" should be (d*)"](then, dependencies);

    sessionDeckSteps["and the currently reviewed flashcard for the box \"(.*)\" should now be at the end of the partition (d)"](() => currentlyReviewedFlashcard, and, dependencies);

    sessionDeckSteps["and the flashcard question to review for the box \"(.*)\" should be \"(.*)\""](and, dependencies)
  });

  test('The player notifies a good answer for a card from the seventh partition', ({ given, then, and, when }) => {
    boxSteps['given a box named "(.*)" containing the following flashcards:'](given, dependencies, box => {
      theBoxBeforeHavingStartedTheSession = box;
    });

    sessionDeckSteps["and the flashcards to review for the current session of the box \"(.*)\" are taken from partitions \"(.*)\""](and, dependencies, (theCurrentlyReviewedFlashcard) => {
      currentlyReviewedFlashcard = theCurrentlyReviewedFlashcard;
    })

    sessionDeckSteps["and the flashcard question to review for the box \"Capitals of the World\" is \"(.*)\""](() => currentlyReviewedFlashcard, and);

    playerSteps["when the player notifies a (good|wrong) answer for the current reviewed flashcard for the box \"(.*)\""](when, dependencies);

    then(/^the currently reviewed flashcard for the box "(.*)" should now be archived$/, async (boxName) => {
      const { boxRepository, authenticationGateway } = dependencies;
      const box = await boxRepository.getBoxByName({
        boxName,
        playerId: authenticationGateway.getCurrentPlayer().id,
      });
      expect(box.archivedFlashcards).toContainEqual(currentlyReviewedFlashcard.flashcard);
    });

    sessionDeckSteps["and the flashcard question to review for the box \"(.*)\" should be \"(.*)\""](and, dependencies)
  });
});