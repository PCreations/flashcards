import { DefineStepFunction } from 'jest-cucumber';
import { AuthenticationGateway } from '../../src/adapters/inMemory/authenticationGateway';
import { BoxRepository } from '../../src/adapters/inMemory/boxRepository';
import { OrderedSet } from 'immutable';
import { Flashcard } from '../../src/domain/box/flashcard';
import { mapBox, addFlashcard, Box } from '../../src/domain/box/box';
import { PartitionNumber } from '../../src/domain/box/partitions';

type FlashcardsDatatable = {
  partition: string;
  question: string;
  answer: string;
}[];

export const createTestBox = ({
  boxName,
  flashcards,
  playerId,
}: {
  boxName: string;
  flashcards: FlashcardsDatatable;
  playerId: string;
}) =>
  mapBox(
    ...flashcards.map(({ partition, ...flashcardProps }) =>
      addFlashcard({
        flashcard: Flashcard(flashcardProps),
        partition: parseInt(partition, 10) as PartitionNumber,
      }),
    ),
  )(Box({ name: boxName, playerId }));

export const boxSteps = {
  'given a box named "(.*)" containing the following flashcards:': (
    given: DefineStepFunction,
    dependencies: { authenticationGateway: AuthenticationGateway; boxRepository: BoxRepository },
    setTheBoxBeforeHavingStartedTheSession: (box: Box) => void = () => { },
  ) => {
    given(/^a box named "(.*)" containing the following flashcards:$/, (boxName, flashcards) => {
      const box = createTestBox({
        boxName,
        flashcards,
        playerId: '42',
      });
      setTheBoxBeforeHavingStartedTheSession(box);
      return dependencies.boxRepository.save(box);
    });
  },
  'then the flashcards in the first partition of his box named "(.*)" should be:': (
    then: DefineStepFunction,
    dependencies: { authenticationGateway: AuthenticationGateway; boxRepository: BoxRepository },
  ) => {
    then(
      /^the flashcards in the first partition of his box named "(.*)" should be:$/,
      async (boxName, flashcards) => {
        const box = await dependencies.boxRepository.getBoxByName({
          boxName,
          playerId: dependencies.authenticationGateway.getCurrentPlayer().id,
        });
        expect(box.partitions.get(1)).toEqual(OrderedSet<Flashcard>(flashcards.map(Flashcard)));
      },
    );
  },
  'given a box named "(.*)" for the current player does not exist$': (
    given: DefineStepFunction,
    dependencies: { authenticationGateway: AuthenticationGateway; boxRepository: BoxRepository },
  ) => {
    given(/^a box named "(.*)" for the current player does not exist$/, async boxName => {
      expect(
        await dependencies.boxRepository.getBoxByName({
          boxName,
          playerId: dependencies.authenticationGateway.getCurrentPlayer().id,
        }),
      ).toBeUndefined;
    });
  },
  'and the current score for the box "(.*)" is (\d*)': (
    and: DefineStepFunction,
    dependencies: { authenticationGateway: AuthenticationGateway; boxRepository: BoxRepository },
  ) => {
    and(/^the current score for the box "(.*)" is (\d*)$/, async (boxName, score) => {
      const { boxRepository, authenticationGateway } = dependencies;
      let box = await boxRepository.getBoxByName({
        boxName,
        playerId: authenticationGateway.getCurrentPlayer().id,
      });
      // todo use a real user path
      return boxRepository.save(box.set('sessionScore', parseInt(score, 10)))
    });
  },
  'then the current score for the box "(.*)" should be (\d*)': (
    then: DefineStepFunction,
    dependencies: { authenticationGateway: AuthenticationGateway; boxRepository: BoxRepository },
  ) => {
    then(/^the current score for the box "(.*)" should be (\d*)$/, async (boxName, expectedScore) => {
      const { boxRepository, authenticationGateway } = dependencies;
      const box = await boxRepository.getBoxByName({
        boxName,
        playerId: authenticationGateway.getCurrentPlayer().id,
      });
      expect(box.sessionScore).toBe(parseInt(expectedScore, 10));
    });
  }
};
