const testDataCreators = require('../../../tests/helpers/dataCreators');
const testDataViews = require('../../../tests/helpers/dataViews');

const { BoxRepository } = require('../../adapters/inMemory/boxRepository');
const { AuthenticationGateway } = require('../../adapters/inMemory/authenticationGateway');
const { Player } = require('../../domain/player/player');
const { Flashcard } = require('../../domain/box/flashcard');
const { FlashcardIdentityService } = require('../../domain/box/flashcardIdentityService');
const { AddFlashcardInBoxUseCase } = require('../addFlashcardInBoxUseCase');

const runSteps = (...fns) => x => fns.reduce(async (y, f) => f(await y), x);

const createSteps = (
  boxRepository = BoxRepository(),
  authenticationGateway = AuthenticationGateway(),
  flashcardIdentityService = FlashcardIdentityService({
    getNextFlashcardId() {
      return 'ghi';
    },
  }),
) => ({
  'given a box named "Capitals of the World" exists for the player "41" with one flashcard in its first partition : id: "abc" | "What is the capital of France ?" | "Paris"': async () =>
    boxRepository.save(
      testDataCreators.createBox({
        boxName: 'Capitals of the World',
        ownedByPlayerWithId: '41',
        partitions: [[{ id: 'abc', question: 'What is the capital of France ?', answer: 'Paris' }]],
      }),
    ),
  'given the current logged in player is player of id "42"': async () =>
    authenticationGateway.authenticate(Player.ofId('42')),
  'and a box owned by player "42" named "Capitals of the World" containing some flashcards in its first partition': async () =>
    boxRepository.save(
      testDataCreators.createBox({
        boxName: 'Capitals of the World',
        ownedByPlayerWithId: '42',
        partitions: [
          [
            { id: 'abc', question: 'What is the capital of France ?', answer: 'Paris' },
            { id: 'def', question: 'What is the capital of Belgium ?', answer: 'Brussels' },
          ],
        ],
      }),
    ),
  'when player "42" adds the flashcard with question "What is the capital of Australia" and the answer "Canberra" in the box named "Capitals of the World"': async () => {
    const useCase = AddFlashcardInBoxUseCase({
      boxRepository,
      authenticationGateway,
      flashcardIdentityService,
    });
    return useCase.handle({
      boxName: 'Capitals of the World',
      flashcard: Flashcard.ofQuestion('What is the capital of Australia ?').withAnswer('Canberra'),
    });
  },
  'then the box "Capitals of the World" should now contain the additional flashcard in its first partition': async () => {
    const retrievedBox = await boxRepository.getBoxByName({
      boxName: 'Capitals of the World',
      playerId: authenticationGateway.getCurrentPlayer().id,
    });
    expect(testDataViews.flashcardsInPartitions({ box: retrievedBox, partitions: [1] })).toEqual([
      {
        id: 'abc',
        question: 'What is the capital of France ?',
        answer: 'Paris',
      },
      {
        id: 'def',
        question: 'What is the capital of Belgium ?',
        answer: 'Brussels',
      },
      {
        id: 'ghi',
        question: 'What is the capital of Australia ?',
        answer: 'Canberra',
      },
    ]);
  },
  'then the box "Capitals of the World" should have been created and contain the added flashcard in its first partition': async () => {
    const retrievedBox = await boxRepository.getBoxByName({
      boxName: 'Capitals of the World',
      playerId: authenticationGateway.getCurrentPlayer().id,
    });
    expect(testDataViews.flashcardsInPartitions({ box: retrievedBox, partitions: [1] })).toEqual([
      {
        id: 'ghi',
        question: 'What is the capital of Australia ?',
        answer: 'Canberra',
      },
    ]);
  },
  'then the box named "Capitals of the World" owned by player of id "41" should still contain only one flashcard in its first partition : id: "abc" | "What is the capital of France ?" | "Paris"': async () => {
    const retrievedBox = await boxRepository.getBoxByName({
      boxName: 'Capitals of the World',
      playerId: '41',
    });
    expect(testDataViews.flashcardsInPartitions({ box: retrievedBox, partitions: [1] })).toEqual([
      {
        id: 'abc',
        question: 'What is the capital of France ?',
        answer: 'Paris',
      },
    ]);
  },
});

test('add flashcard in existing box use case', () => {
  const boxRepository = BoxRepository();
  const authenticationGateway = AuthenticationGateway();

  const steps = createSteps(boxRepository, authenticationGateway);

  return runSteps(
    steps['given the current logged in player is player of id "42"'],
    steps[
      'and a box owned by player "42" named "Capitals of the World" containing some flashcards in its first partition'
    ],
    steps[
      'when player "42" adds the flashcard with question "What is the capital of Australia" and the answer "Canberra" in the box named "Capitals of the World"'
    ],
    steps[
      'then the box "Capitals of the World" should now contain the additional flashcard in its first partition'
    ],
  )();
});

test('add flashcard in a non existing box use case', () => {
  const boxRepository = BoxRepository();
  const authenticationGateway = AuthenticationGateway();

  const steps = createSteps(boxRepository, authenticationGateway);

  return runSteps(
    steps['given the current logged in player is player of id "42"'],
    steps[
      'when player "42" adds the flashcard with question "What is the capital of Australia" and the answer "Canberra" in the box named "Capitals of the World"'
    ],
    steps[
      'then the box "Capitals of the World" should have been created and contain the added flashcard in its first partition'
    ],
  )();
});

test('add a flashcard in a non existing box for a given player but already existing for an other player', () => {
  const boxRepository = BoxRepository();
  const authenticationGateway = AuthenticationGateway();

  const steps = createSteps(boxRepository, authenticationGateway);

  return runSteps(
    steps[
      'given a box named "Capitals of the World" exists for the player "41" with one flashcard in its first partition : id: "abc" | "What is the capital of France ?" | "Paris"'
    ],
    steps['given the current logged in player is player of id "42"'],
    steps[
      'when player "42" adds the flashcard with question "What is the capital of Australia" and the answer "Canberra" in the box named "Capitals of the World"'
    ],
    steps[
      'then the box "Capitals of the World" should have been created and contain the added flashcard in its first partition'
    ],
    steps[
      'then the box named "Capitals of the World" owned by player of id "41" should still contain only one flashcard in its first partition : id: "abc" | "What is the capital of France ?" | "Paris"'
    ],
  )();
});
