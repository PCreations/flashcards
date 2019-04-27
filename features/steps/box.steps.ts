import expect from 'expect';
import isEqual from 'lodash/isEqual';
import dayjs from 'dayjs';
import { Given, Then } from 'cucumber';
import { PartitionNumber } from '../../src/domain/box/partitions';
import { StartSessionUseCase } from '../../src/useCases/startSessionUseCase';
import { NotifyAnswerUseCase } from '../../src/useCases/notifyAnswerUseCase';
import { Box, mapBox, addFlashcard } from '../../src/domain/box/box';
import { Flashcard } from '../../src/domain/box/flashcard';

Then('the flashcards in the first partition of his box named {string} should be:', async function(
  boxName,
  flashcards,
) {
  const { boxRepository, authenticationGateway } = this.dependencies;
  const box = await boxRepository.getBoxByName({
    boxName,
    playerId: authenticationGateway.getCurrentPlayer().id,
  });
  expect(box.partitions.get(1)).toEqual(flashcards.hashes().map(Flashcard));
});

Given('the box named {string} does not contain any flashcard in its first partition', function(boxName) {
  const { boxRepository, authenticationGateway } = this.dependencies;
  return boxRepository.save(
    Box({
      name: boxName,
      playerId: authenticationGateway.getCurrentPlayer().id,
    }),
  );
});

Given('the box named {string} does not exist yet', async function(boxName) {
  const { boxRepository, authenticationGateway } = this.dependencies;
  const currentPlayerId = authenticationGateway.getCurrentPlayer().id;
  const nonExistingBox = await boxRepository.getBoxByName({ boxName, playerId: currentPlayerId });
  expect(nonExistingBox).toBeUndefined();
});

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
    expect(box.partitions.get(1)).toEqual(flashcards.hashes().map(Flashcard));
  },
);

Given('a box named {string} containing the following flashcards:', function(boxName, flashcards) {
  const { boxRepository, authenticationGateway } = this.dependencies;
  const partitionsData: {
    partition: PartitionNumber;
    question: string;
    answer: string;
  }[] = flashcards.hashes();
  return boxRepository.save(
    mapBox(
      ...partitionsData.map(({ question, partition, answer }) =>
        addFlashcard({ flashcard: Flashcard({ question, answer }), partition }),
      ),
    )(
      Box({
        name: boxName,
        playerId: authenticationGateway.getCurrentPlayer().id,
      }),
    ),
  );
});

Then('the currently reviewed flashcard for the box {string} should now be archived', async function(boxName) {
  const { boxRepository, authenticationGateway } = this.dependencies;
  const box = await boxRepository.getBoxByName({
    boxName,
    playerId: authenticationGateway.getCurrentPlayer().id,
  });
  expect(box.archivedFlashcards).toContainEqual(this.currentlyReviewingFlashcard);
});

Given(
  'the flashcards to review for the current session of the box {string} are taken from partitions {string}',
  async function(boxName, comaSeparatedPartitions) {
    const { boxRepository, authenticationGateway } = this.dependencies;
    const startSessionUseCase = StartSessionUseCase({ boxRepository, authenticationGateway });
    const expectedPartitions = comaSeparatedPartitions
      .split(',')
      .map((stringNumber: string) => parseInt(stringNumber, 10)) as PartitionNumber[];
    let box = await boxRepository.getBoxByName({
      boxName,
      playerId: authenticationGateway.getCurrentPlayer().id,
    });
    while (!isEqual(box.sessionsPartitions, expectedPartitions)) {
      await startSessionUseCase.handle({
        boxName,
        today: dayjs(box.lastStartedSessionDate)
          .add(1, 'day')
          .toDate(),
      });
      box = await boxRepository.getBoxByName({
        boxName,
        playerId: authenticationGateway.getCurrentPlayer().id,
      });
    }
    this.currentlyReviewingFlashcard = box.sessionFlashcards.first();
  },
);

Given('the current score for the box {string} is {int}', async function(boxName, score) {
  const { boxRepository, authenticationGateway } = this.dependencies;
  const notifyAnswerUseCase = NotifyAnswerUseCase({ boxRepository, authenticationGateway });
  let box = await boxRepository.getBoxByName({
    boxName,
    playerId: authenticationGateway.getCurrentPlayer().id,
  });
  while (box.sessionScore !== score) {
    await notifyAnswerUseCase.handle({ boxName, didCorrectlyAnswer: true });
    box = await boxRepository.getBoxByName({
      boxName,
      playerId: authenticationGateway.getCurrentPlayer().id,
    });
  }
});

Then(
  'the currently reviewed flashcard for the box {string} should now be at the end of the partition {int}',
  async function(boxName, partitionNumber) {
    const { boxRepository, authenticationGateway } = this.dependencies;
    const box = await boxRepository.getBoxByName({
      boxName,
      playerId: authenticationGateway.getCurrentPlayer().id,
    });
    expect(box.partitions.get(partitionNumber).last()).toEqual(this.currentlyReviewingFlashcard.flashcard);
  },
);

Then('the current score for the box {string} should be {int}', async function(boxName, score) {
  const { boxRepository, authenticationGateway } = this.dependencies;
  const box = await boxRepository.getBoxByName({
    boxName,
    playerId: authenticationGateway.getCurrentPlayer().id,
  });
  expect(box.sessionScore).toBe(score);
});
