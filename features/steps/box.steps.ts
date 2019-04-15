import expect from 'expect';
import { Given, Then } from 'cucumber';
import { PartitionNumber } from '../../src/domain/box/partitions';
import { createBox } from '../../testsUtils/helpers/dataCreators';
import { flashcardsInPartitions } from '../../testsUtils/helpers/dataViews';

Given('a box named {string} that contains these flashcards in its first partition already exists:', function(
  boxName,
  flashcards,
) {
  const { boxRepository, authenticationGateway } = this.dependencies;
  return boxRepository.save(
    createBox({
      boxName,
      ownedByPlayerWithId: authenticationGateway.getCurrentPlayer().id,
      partitions: [flashcards.hashes()],
    }),
  );
});

Then('the flashcards in the first partition of his box named {string} should be:', async function(
  boxName,
  flashcards,
) {
  const { boxRepository, authenticationGateway } = this.dependencies;
  const box = await boxRepository.getBoxByName({
    boxName,
    playerId: authenticationGateway.getCurrentPlayer().id,
  });
  expect(flashcardsInPartitions({ box, partitions: [1] })).toEqual(flashcards.hashes());
});

Given('the box named {string} does not contain any flashcard in its first partition', function(boxName) {
  const { boxRepository, authenticationGateway } = this.dependencies;
  return boxRepository.save(
    createBox({
      boxName,
      ownedByPlayerWithId: authenticationGateway.getCurrentPlayer().id,
    }),
  );
});

Given('the box named {string} does not exist yet', async function(boxName) {
  const { boxRepository, authenticationGateway } = this.dependencies;
  const currentPlayerId = authenticationGateway.getCurrentPlayer().id;
  const nonExistingBox = await boxRepository.getBoxByName({ boxName, playerId: currentPlayerId });
  expect(nonExistingBox).toBeUndefined();
});

Given(
  'a box named {string} created by player of id {string} already exists with following flashcards in its first partition:',
  function(boxName, ownedByPlayerWithId, flashcards) {
    const { boxRepository } = this.dependencies;
    return boxRepository.save(
      createBox({
        boxName,
        ownedByPlayerWithId,
        partitions: [flashcards.hashes()],
      }),
    );
  },
);

Given('a box named {string} for the current player does not exist', async function(boxName) {
  const { boxRepository, authenticationGateway } = this.dependencies;
  const box = await boxRepository.getBoxByName({
    boxName,
    playerId: authenticationGateway.getCurrentPlayer().id,
  });
  expect(box).toBeUndefined();
});

Then(
  'the flashcards in the first partition of the box named {string} owned by the player of id {string} should be:',
  async function(boxName, ownedByPlayerWithId, flashcards) {
    const { boxRepository } = this.dependencies;
    const box = await boxRepository.getBoxByName({
      boxName,
      playerId: ownedByPlayerWithId,
    });
    expect(flashcardsInPartitions({ box, partitions: [1] })).toEqual(flashcards.hashes());
  },
);

Given('a box named {string} containing the following flashcards:', function(boxName, flashcards) {
  const { boxRepository, authenticationGateway } = this.dependencies;
  const partitionsData: {
    partition: PartitionNumber;
    id: string;
    question: string;
    answer: string;
  }[] = flashcards.hashes();
  const partitions: {
    id: string;
    question: string;
    answer: string;
  }[][] = [[], [], [], [], [], [], []];
  partitionsData.forEach(({ partition, ...flashcardData }) => {
    partitions[partition - 1] = [...partitions[partition - 1], flashcardData];
  });
  return boxRepository.save(
    createBox({
      boxName,
      ownedByPlayerWithId: authenticationGateway.getCurrentPlayer().id,
      partitions,
    }),
  );
});
