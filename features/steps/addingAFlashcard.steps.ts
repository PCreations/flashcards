import { OrderedSet } from 'immutable';
import { loadFeature, defineFeature } from 'jest-cucumber';
import { playerSteps } from './playerSteps';
import { createDepsContainer } from '../dependencies';
import { boxSteps, createTestBox } from './boxSteps';
import { Box } from '../../src/domain/box/box';
import { Flashcard } from '../../src/domain/box/flashcard';
import { Player } from '../../src/domain/player/player';

const feature = loadFeature('./features/addingAFlashcard.feature');

defineFeature(feature, test => {
  const depsContainer = createDepsContainer();

  beforeEach(async () => {
    await depsContainer.loadDependencies();
    return depsContainer.dependencies.authenticationGateway.authenticate(Player({ id: '42' }));
  });

  test('The box exists and its first partition is not empty', ({ given, when, then }) => {
    boxSteps['given a box named "(.*)" containing the following flashcards:'](given, depsContainer);
    playerSteps['when the current player adds the following flashcard in his box named "(.*)":'](
      when,
      depsContainer,
    );
    boxSteps['then the flashcards in the first partition of his box named "(.*)" should be:'](
      then,
      depsContainer,
    );
  });
  test('A box with the same name has already been created by an other player', ({
    given,
    and,
    when,
    then,
  }) => {
    given(
      /^a box named "(.*)" created by player of id "(.*)" containing the following flashcards:$/,
      (boxName, playerId, flashcards) => {
        console.log(depsContainer.dependencies)
        return depsContainer.dependencies.boxRepository.save(
          createTestBox({
            boxName,
            flashcards,
            playerId,
          }),
        )
      }
    );
    boxSteps['given a box named "(.*)" for the current player does not exist$'](given, depsContainer);
    playerSteps['when the current player adds the following flashcard in his box named "(.*)":'](
      when,
      depsContainer,
    );
    boxSteps['then the flashcards in the first partition of his box named "(.*)" should be:'](
      then,
      depsContainer,
    );
    and(
      /^the flashcards in the first partition of the box named "(.*)" owned by the player of id "(.*)" should be:$/,
      async (boxName, playerId, flashcards) => {
        const box = await depsContainer.dependencies.boxRepository.getBoxByName({
          boxName,
          playerId,
        });
        expect(box.partitions.get(1)).toEqual(OrderedSet<Flashcard>(flashcards.map(Flashcard)));
      },
    );
  });
  test('The box exists and its first partition is empty', ({ given, when, then }) => {
    given(/^the box named "(.*)" does not contain any flashcard in its first partition$/, boxName =>
      depsContainer.dependencies.boxRepository.save(
        Box({
          name: boxName,
          playerId: depsContainer.dependencies.authenticationGateway.getCurrentPlayer().id,
        }),
      ),
    );
    playerSteps['when the current player adds the following flashcard in his box named "(.*)":'](
      when,
      depsContainer,
    );
    boxSteps['then the flashcards in the first partition of his box named "(.*)" should be:'](
      then,
      depsContainer,
    );
  });
  test('The box does not exist yet', ({ given, when, then }) => {
    boxSteps['given a box named "(.*)" for the current player does not exist$'](given, depsContainer);
    playerSteps['when the current player adds the following flashcard in his box named "(.*)":'](
      when,
      depsContainer,
    );
    boxSteps['then the flashcards in the first partition of his box named "(.*)" should be:'](
      then,
      depsContainer,
    );
  });
});
