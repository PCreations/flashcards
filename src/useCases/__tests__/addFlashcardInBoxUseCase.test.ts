import { BoxRepository } from '../../adapters/inMemory/boxRepository';
import { AuthenticationGateway } from '../../adapters/inMemory/authenticationGateway';
import { Player } from '../../domain/player/player';
import { Flashcard } from '../../domain/box/flashcard';
import { AddFlashcardInBoxUseCase } from '../addFlashcardInBoxUseCase';
import { mapBox, addFlashcard } from '../../domain/box/box';
import { OrderedSet } from 'immutable';

const runSteps = (...fns: any[]) => (x?: any) => fns.reduce(async (y, f) => f(await y), x);

const createSteps = (boxRepository: BoxRepository, authenticationGateway: AuthenticationGateway) => ({
  'given a box named "Capitals of the World" exists for the player "41" with one flashcard in its first partition : "What is the capital of France ?" | "Paris"': async () =>
    boxRepository.save(
      mapBox(
        box => box.set('name', 'Capitals of the World').set('playerId', '41'),
        addFlashcard({
          flashcard: Flashcard({ question: 'What is the capital of France ?', answer: 'Paris' }),
          partition: 1,
        }),
      )(),
    ),
  'given the current logged in player is player of id "42"': async () =>
    authenticationGateway.authenticate(Player({ id: '42' })),
  'and a box owned by player "42" named "Capitals of the World" containing some flashcards in its first partition': async () =>
    boxRepository.save(
      mapBox(
        box => box.set('name', 'Capitals of the World').set('playerId', '42'),
        addFlashcard({
          flashcard: Flashcard({ question: 'What is the capital of France ?', answer: 'Paris' }),
          partition: 1,
        }),
        addFlashcard({
          flashcard: Flashcard({ question: 'What is the capital of Belgium ?', answer: 'Brussels' }),
          partition: 1,
        }),
      )(),
    ),
  'when player "42" adds the flashcard with question "What is the capital of Australia" and the answer "Canberra" in the box named "Capitals of the World"': async () => {
    const useCase = AddFlashcardInBoxUseCase({
      boxRepository,
      authenticationGateway,
    });
    return useCase.handle({
      boxName: 'Capitals of the World',
      flashcard: Flashcard({ question: 'What is the capital of Australia ?', answer: 'Canberra' }),
    });
  },
  'then the box "Capitals of the World" should now contain the additional flashcard in its first partition': async () => {
    const retrievedBox = await boxRepository.getBoxByName({
      boxName: 'Capitals of the World',
      playerId: authenticationGateway.getCurrentPlayer().id,
    });
    expect(retrievedBox.partitions.get(1)).toEqual(
      OrderedSet<Flashcard>([
        Flashcard({
          question: 'What is the capital of France ?',
          answer: 'Paris',
        }),
        Flashcard({
          question: 'What is the capital of Belgium ?',
          answer: 'Brussels',
        }),
        Flashcard({
          question: 'What is the capital of Australia ?',
          answer: 'Canberra',
        }),
      ]),
    );
  },
  'then the box "Capitals of the World" should have been created and contain the added flashcard in its first partition': async () => {
    const retrievedBox = await boxRepository.getBoxByName({
      boxName: 'Capitals of the World',
      playerId: authenticationGateway.getCurrentPlayer().id,
    });
    expect(retrievedBox.partitions.get(1)).toEqual(
      OrderedSet<Flashcard>([
        Flashcard({
          question: 'What is the capital of Australia ?',
          answer: 'Canberra',
        }),
      ]),
    );
  },
  'then the box named "Capitals of the World" owned by player of id "41" should still contain only one flashcard in its first partition : id: "abc" | "What is the capital of France ?" | "Paris"': async () => {
    const retrievedBox = await boxRepository.getBoxByName({
      boxName: 'Capitals of the World',
      playerId: '41',
    });
    expect(retrievedBox.partitions.get(1)).toEqual(
      OrderedSet<Flashcard>([
        Flashcard({
          question: 'What is the capital of France ?',
          answer: 'Paris',
        }),
      ]),
    );
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
      'given a box named "Capitals of the World" exists for the player "41" with one flashcard in its first partition : "What is the capital of France ?" | "Paris"'
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
