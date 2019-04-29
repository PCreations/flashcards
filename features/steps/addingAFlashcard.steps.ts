import { OrderedSet } from 'immutable';
import { loadFeature, defineFeature } from 'jest-cucumber';
import { playerSteps } from './playerSteps';
import { boxSteps, createTestBox } from './boxSteps';
import { BoxRepository } from '../../src/adapters/inMemory/boxRepository';
import { AuthenticationGateway } from '../../src/adapters/inMemory/authenticationGateway';
import { Box } from '../../src/domain/box/box';
import { Flashcard } from '../../src/domain/box/flashcard';
import { Player } from '../../src/domain/player/player';

const feature = loadFeature('./features/addingAFlashcard.feature');

defineFeature(feature, test => {
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

  test('The box exists and its first partition is not empty', ({ given, when, then }) => {
    boxSteps['given a box named "(.*)" containing the following flashcards:'](given, dependencies);
    playerSteps['when the current player adds the following flashcard in his box named "(.*)":'](
      when,
      dependencies,
    );
    boxSteps['then the flashcards in the first partition of his box named "(.*)" should be:'](
      then,
      dependencies,
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
      (boxName, playerId, flashcards) =>
        dependencies.boxRepository.save(
          createTestBox({
            boxName,
            flashcards,
            playerId,
          }),
        ),
    );
    boxSteps['given a box named "(.*)" for the current player does not exist$'](given, dependencies);
    playerSteps['when the current player adds the following flashcard in his box named "(.*)":'](
      when,
      dependencies,
    );
    boxSteps['then the flashcards in the first partition of his box named "(.*)" should be:'](
      then,
      dependencies,
    );
    and(
      /^the flashcards in the first partition of the box named "(.*)" owned by the player of id "(.*)" should be:$/,
      async (boxName, playerId, flashcards) => {
        const box = await dependencies.boxRepository.getBoxByName({
          boxName,
          playerId,
        });
        expect(box.partitions.get(1)).toEqual(OrderedSet<Flashcard>(flashcards.map(Flashcard)));
      },
    );
  });
  test('The box exists and its first partition is empty', ({ given, when, then }) => {
    given(/^the box named "(.*)" does not contain any flashcard in its first partition$/, boxName =>
      dependencies.boxRepository.save(
        Box({
          name: boxName,
          playerId: dependencies.authenticationGateway.getCurrentPlayer().id,
        }),
      ),
    );
    playerSteps['when the current player adds the following flashcard in his box named "(.*)":'](
      when,
      dependencies,
    );
    boxSteps['then the flashcards in the first partition of his box named "(.*)" should be:'](
      then,
      dependencies,
    );
  });
  test('The box does not exist yet', ({ given, when, then }) => {
    boxSteps['given a box named "(.*)" for the current player does not exist$'](given, dependencies);
    playerSteps['when the current player adds the following flashcard in his box named "(.*)":'](
      when,
      dependencies,
    );
    boxSteps['then the flashcards in the first partition of his box named "(.*)" should be:'](
      then,
      dependencies,
    );
  });
});
