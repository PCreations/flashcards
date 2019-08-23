import { loadFeature, defineFeature } from 'jest-cucumber';
import { boxSteps } from './boxSteps';
import { Player } from '../../src/domain/player/player';
import { Box, SessionFlashcard } from '../../src/domain/box/box';
import { sessionDeckSteps } from './sessionDeckSteps';
import { playerSteps } from './playerSteps';
import { createDepsContainer } from '../dependencies';

const feature = loadFeature('./features/notifyingAnswer.feature');

defineFeature(feature, test => {
  let theBoxBeforeHavingStartedTheSession: Box;
  let currentlyReviewedFlashcard: SessionFlashcard;
  const depsContainer = createDepsContainer();

  beforeEach(async () => {
    await depsContainer.loadDependencies();
    return depsContainer.dependencies.player.authenticate(Player({ id: '42' }));
  });

  test('The player notifies a good answer for a card from the second partition', ({
    given,
    and,
    when,
    then,
  }) => {
    boxSteps['given a box named "(.*)" containing the following flashcards:'](given, depsContainer, box => {
      theBoxBeforeHavingStartedTheSession = box;
    });

    sessionDeckSteps[
      'and the flashcards to review for the current session of the box "(.*)" are taken from partitions "(.*)"'
    ](and, depsContainer, theCurrentlyReviewedFlashcard => {
      currentlyReviewedFlashcard = theCurrentlyReviewedFlashcard;
    });

    sessionDeckSteps['and the flashcard question to review for the box "Capitals of the World" is "(.*)"'](
      () => currentlyReviewedFlashcard,
      and,
    );

    boxSteps['and the current score for the box "(.*)" is (d*)'](and, depsContainer);

    playerSteps[
      'when the player notifies a (good|wrong) answer for the current reviewed flashcard for the box "(.*)"'
    ](when, depsContainer);

    boxSteps['then the current score for the box "(.*)" should be (d*)'](then, depsContainer);

    sessionDeckSteps[
      'and the currently reviewed flashcard for the box "(.*)" should now be at the end of the partition (d)'
    ](() => currentlyReviewedFlashcard, and, depsContainer);

    sessionDeckSteps['and the flashcard question to review for the box "(.*)" should be "(.*)"'](
      and,
      depsContainer,
    );
  });

  test('The player notifies a wrong answer for a card from the second partition', ({
    given,
    and,
    when,
    then,
  }) => {
    boxSteps['given a box named "(.*)" containing the following flashcards:'](given, depsContainer, box => {
      theBoxBeforeHavingStartedTheSession = box;
    });

    sessionDeckSteps[
      'and the flashcards to review for the current session of the box "(.*)" are taken from partitions "(.*)"'
    ](and, depsContainer, theCurrentlyReviewedFlashcard => {
      currentlyReviewedFlashcard = theCurrentlyReviewedFlashcard;
    });

    sessionDeckSteps['and the flashcard question to review for the box "Capitals of the World" is "(.*)"'](
      () => currentlyReviewedFlashcard,
      and,
    );

    boxSteps['and the current score for the box "(.*)" is (d*)'](and, depsContainer);

    playerSteps[
      'when the player notifies a (good|wrong) answer for the current reviewed flashcard for the box "(.*)"'
    ](when, depsContainer);

    boxSteps['then the current score for the box "(.*)" should be (d*)'](then, depsContainer);

    sessionDeckSteps[
      'and the currently reviewed flashcard for the box "(.*)" should now be at the end of the partition (d)'
    ](() => currentlyReviewedFlashcard, and, depsContainer);

    sessionDeckSteps['and the flashcard question to review for the box "(.*)" should be "(.*)"'](
      and,
      depsContainer,
    );
  });

  test('The player notifies a good answer for a card from the seventh partition', ({
    given,
    then,
    and,
    when,
  }) => {
    boxSteps['given a box named "(.*)" containing the following flashcards:'](given, depsContainer, box => {
      theBoxBeforeHavingStartedTheSession = box;
    });

    sessionDeckSteps[
      'and the flashcards to review for the current session of the box "(.*)" are taken from partitions "(.*)"'
    ](and, depsContainer, theCurrentlyReviewedFlashcard => {
      currentlyReviewedFlashcard = theCurrentlyReviewedFlashcard;
    });

    sessionDeckSteps['and the flashcard question to review for the box "Capitals of the World" is "(.*)"'](
      () => currentlyReviewedFlashcard,
      and,
    );

    playerSteps[
      'when the player notifies a (good|wrong) answer for the current reviewed flashcard for the box "(.*)"'
    ](when, depsContainer);

    then(/^the currently reviewed flashcard for the box "(.*)" should now be archived$/, async boxName => {
      const box = await depsContainer.dependencies.box.getBoxByNameAndPlayerId({
        boxName,
        playerId: depsContainer.dependencies.player.getCurrentPlayerId(),
      });
      expect(box.archivedFlashcards).toContainEqual(currentlyReviewedFlashcard.flashcard);
    });

    sessionDeckSteps['and the flashcard question to review for the box "(.*)" should be "(.*)"'](
      and,
      depsContainer,
    );
  });
});
