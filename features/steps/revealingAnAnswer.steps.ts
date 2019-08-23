import { loadFeature, defineFeature } from 'jest-cucumber';
import { boxSteps } from './boxSteps';
import { Player } from '../../src/domain/player/player';
import { sessionDeckSteps } from './sessionDeckSteps';
import { SessionFlashcard } from '../../src/domain/box/box';
import { currentFlashcardAnswerQuery as createCurrentFlashcardAnswerQuery } from '../../src/queries/currentFlashcardAnswerQuery';
import { createDepsContainer } from '../dependencies';

const feature = loadFeature('./features/revealingAnAnswer.feature');

defineFeature(feature, test => {
  let currentlyReviewedFlashcard: SessionFlashcard;
  const depsContainer = createDepsContainer();

  beforeEach(async () => {
    await depsContainer.loadDependencies();
    return depsContainer.dependencies.player.authenticate(Player({ id: '42' }));
  });

  test('The player reveals the answer for the flashcard he is reviewing', ({ given, and, when, then }) => {
    boxSteps['given a box named "(.*)" containing the following flashcards:'](given, depsContainer);

    sessionDeckSteps[
      'and the flashcards to review for the current session of the box "(.*)" are taken from partitions "(.*)"'
    ](and, depsContainer, theCurrentlyReviewedFlashcard => {
      currentlyReviewedFlashcard = theCurrentlyReviewedFlashcard;
    });

    sessionDeckSteps['and the flashcard question to review for the box "Capitals of the World" is "(.*)"'](
      () => currentlyReviewedFlashcard,
      and,
    );

    when(/^the player reveals the answer of the current reviewed flashcard for the box "(.*)"$/, arg0 => {});

    then(
      /^the answer of the current reviewed flashcard for the box "(.*)" should be "(.*)"$/,
      async (boxName, expectedAnswer) => {
        const currentFlashcardAnswerQuery = createCurrentFlashcardAnswerQuery(
          depsContainer.dependencies.box.getBoxByNameAndPlayerId,
        );
        const flashcardAnswer = await currentFlashcardAnswerQuery({
          boxName,
          playerId: depsContainer.dependencies.player.getCurrentPlayerId(),
        });
        expect(flashcardAnswer).toEqual(expectedAnswer);
      },
    );
  });
});
