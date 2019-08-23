import { DefineStepFunction } from 'jest-cucumber';
import { OrderedSet } from 'immutable';
import { Flashcard } from '../../src/domain/box/flashcard';
import { mapBox, addFlashcard, Box } from '../../src/domain/box/box';
import { PartitionNumber } from '../../src/domain/box/partitions';
import { DependenciesContainer } from '../../features/dependencies';

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
    depsContainer: DependenciesContainer,
    setTheBoxBeforeHavingStartedTheSession: (box: Box) => void = () => {},
  ) => {
    given(/^a box named "(.*)" containing the following flashcards:$/, async (boxName, flashcards) => {
      const box = createTestBox({
        boxName,
        flashcards,
        playerId: '42',
      });
      await depsContainer.dependencies.box.saveBox(box);
      setTheBoxBeforeHavingStartedTheSession(
        await depsContainer.dependencies.box.getBoxByNameAndPlayerId({ boxName, playerId: '42' }),
      );
    });
  },
  'then the flashcards in the first partition of his box named "(.*)" should be:': (
    then: DefineStepFunction,
    depsContainer: DependenciesContainer,
  ) => {
    then(
      /^the flashcards in the first partition of his box named "(.*)" should be:$/,
      async (boxName, flashcards) => {
        const box = await depsContainer.dependencies.box.getBoxByNameAndPlayerId({
          boxName,
          playerId: depsContainer.dependencies.player.getCurrentPlayerId(),
        });
        expect(box.partitions.get(1)).toEqual(OrderedSet<Flashcard>(flashcards.map(Flashcard)));
      },
    );
  },
  'given a box named "(.*)" for the current player does not exist$': (
    given: DefineStepFunction,
    depsContainer: DependenciesContainer,
  ) => {
    given(/^a box named "(.*)" for the current player does not exist$/, async boxName => {
      expect(
        await depsContainer.dependencies.box.getBoxByNameAndPlayerId({
          boxName,
          playerId: depsContainer.dependencies.player.getCurrentPlayerId(),
        }),
      ).toBeUndefined();
    });
  },
  'and the current score for the box "(.*)" is (d*)': (
    and: DefineStepFunction,
    depsContainer: DependenciesContainer,
  ) => {
    and(/^the current score for the box "(.*)" is (\d*)$/, async (boxName, score) => {
      let box = await depsContainer.dependencies.box.getBoxByNameAndPlayerId({
        boxName,
        playerId: depsContainer.dependencies.player.getCurrentPlayerId(),
      });
      // todo use a real user path
      return depsContainer.dependencies.box.saveBox(box.set('sessionScore', parseInt(score, 10)));
    });
  },
  'then the current score for the box "(.*)" should be (d*)': (
    then: DefineStepFunction,
    depsContainer: DependenciesContainer,
  ) => {
    then(/^the current score for the box "(.*)" should be (\d*)$/, async (boxName, expectedScore) => {
      const box = await depsContainer.dependencies.box.getBoxByNameAndPlayerId({
        boxName,
        playerId: depsContainer.dependencies.player.getCurrentPlayerId(),
      });
      expect(box.sessionScore).toBe(parseInt(expectedScore, 10));
    });
  },
};
