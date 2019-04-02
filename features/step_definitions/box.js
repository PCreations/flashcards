const expect = require('expect');
const { Given, Then } = require('cucumber');
const testDataCreators = require('../../tests/helpers/dataCreators');
const testDataViews = require('../../tests/helpers/dataViews');
const { getDependencies } = require('../getDependencies');

Given('a box named {string} that contains these flashcards in its first partition already exists:', function(
  boxName,
  flashcards,
) {
  const { boxRepository, authenticationGateway } = getDependencies(this);
  return boxRepository.save(
    testDataCreators.createBox({
      boxName,
      ownedByPlayerWithId: authenticationGateway.getCurrentPlayer().id,
      flashcards: flashcards.hashes(),
    }),
  );
});

Then('the flashcards in the first partition of his box named {string} should be:', async function(
  boxName,
  flashcards,
) {
  const { boxRepository, authenticationGateway } = getDependencies(this);
  const box = await boxRepository.getBoxByName({
    boxName,
    playerId: authenticationGateway.getCurrentPlayer().id,
  });
  expect(testDataViews.flashcardsView(box.getFlashcardsInPartition(1))).toEqual(flashcards.hashes());
});

Given('the box named {string} does not contain any flashcard in its first partition', function(boxName) {
  const { boxRepository, authenticationGateway } = getDependencies(this);
  return boxRepository.save(
    testDataCreators.createBox({
      boxName,
      ownedByPlayerWithId: authenticationGateway.getCurrentPlayer().id,
      flashcards: [],
    }),
  );
});

Given('the box named {string} does not exist yet', function(string) {});

Given(
  'a box named {string} created by player of id {string} already exists with following flashcards in its first partition:',
  async function(boxName, ownedByPlayerWithId, flashcards) {
    const { boxRepository } = getDependencies(this);
    await boxRepository.save(
      testDataCreators.createBox({
        boxName,
        ownedByPlayerWithId,
        flashcards: flashcards.hashes(),
      }),
    );
  },
);

Given('a box named {string} for the current player does not exist', async function(boxName) {
  const { boxRepository, authenticationGateway } = getDependencies(this);
  const box = await boxRepository.getBoxByName({
    boxName,
    playerId: authenticationGateway.getCurrentPlayer().id,
  });
  expect(box).toBeUndefined();
});

Then(
  'the flashcards in the first partition of the box named {string} owned by the player of id {string} should be:',
  async function(boxName, ownedByPlayerWithId, flashcards) {
    const { boxRepository } = getDependencies(this);
    const box = await boxRepository.getBoxByName({
      boxName,
      playerId: ownedByPlayerWithId,
    });
    expect(testDataViews.flashcardsView(box.getFlashcardsInPartition(1))).toEqual(flashcards.hashes());
  },
);

Given('a box named {string} containing the following flashcards:', function(boxName, flashcards) {
  const { boxRepository, authenticationGateway } = getDependencies(this);
  return boxRepository.save(
    testDataCreators.createBox({
      boxName,
      ownedByPlayerWithId: authenticationGateway.getCurrentPlayer().id,
      flashcards: flashcards.hashes(),
    }),
  );
});
