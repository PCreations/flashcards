import { loadFeature, defineFeature } from 'jest-cucumber';
import { boxSteps } from './boxSteps';
import { BoxRepository } from '../../src/adapters/inMemory/boxRepository';
import { AuthenticationGateway } from '../../src/adapters/inMemory/authenticationGateway';
import { Player } from '../../src/domain/player/player';
import { sessionDeckSteps } from './sessionDeckSteps';
import { SessionFlashcard } from '../../src/domain/box/box';
import { CurrentFlashcardAnswerQuery } from '../../src/queries/currentFlashcardAnswerQuery';

const feature = loadFeature('./features/revealingAnAnswer.feature');

defineFeature(feature, test => {
  let currentlyReviewedFlashcard: SessionFlashcard;
  const dependencies = (() => {
    let boxRepository: BoxRepository;
    let authenticationGateway: AuthenticationGateway;
    return {
      get boxRepository() {
        return boxRepository;
      },
      get authenticationGateway() {
        return authenticationGateway;
      },
      set boxRepository(theBoxRepository) {
        boxRepository = theBoxRepository;
      },
      set authenticationGateway(theAuthenticationGateway) {
        authenticationGateway = theAuthenticationGateway;
      },
    };
  })();

  beforeEach(() => {
    dependencies.boxRepository = BoxRepository();
    dependencies.authenticationGateway = AuthenticationGateway();
    return dependencies.authenticationGateway.authenticate(Player({ id: '42' }));
  });
  test('The player reveals the answer for the flashcard he is reviewing', ({ given, and, when, then }) => {
    boxSteps["given a box named \"(.*)\" containing the following flashcards:"](given, dependencies);

    sessionDeckSteps["and the flashcards to review for the current session of the box \"(.*)\" are taken from partitions \"(.*)\""](and, dependencies, theCurrentlyReviewedFlashcard => {
      currentlyReviewedFlashcard = theCurrentlyReviewedFlashcard;
    })

    sessionDeckSteps["and the flashcard question to review for the box \"Capitals of the World\" is \"(.*)\""](() => currentlyReviewedFlashcard, and)

    when(/^the player reveals the answer of the current reviewed flashcard for the box "(.*)"$/, (arg0) => {

    });

    then(/^the answer of the current reviewed flashcard for the box "(.*)" should be "(.*)"$/, async (boxName, expectedAnswer) => {
      const { boxRepository, authenticationGateway } = dependencies;
      const currentFlashcardAnswerQuery = CurrentFlashcardAnswerQuery({ boxRepository });
      const flashcardAnswer = await currentFlashcardAnswerQuery.execute({
        boxName,
        playerId: authenticationGateway.getCurrentPlayer().id,
      });
      expect(flashcardAnswer).toEqual(expectedAnswer);
    });
  });
});