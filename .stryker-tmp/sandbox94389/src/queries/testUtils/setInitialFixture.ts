import { Range, Set } from 'immutable';
import { mapBox, Box, addFlashcard } from '../../domain/box/box';
import { Flashcard } from '../../domain/box/flashcard';
import { PartitionNumber } from '../../domain/box/partitions';
import { BoxRepository } from '../../adapters/inMemory/boxRepository';
import { AuthenticationGateway } from '../../adapters/inMemory/authenticationGateway';
import { Player } from '../../domain/player/player';

const createFlashcard = (flashcardNumber: number) =>
  Flashcard({ question: `q${flashcardNumber}`, answer: `a${flashcardNumber}` });

const addFlashcardsInPartition = (partitionNumber: PartitionNumber) => (flashcardsCountToGenerate: number) =>
  Range(0, flashcardsCountToGenerate)
    .map(createFlashcard)
    .map(flashcard =>
      addFlashcard({
        flashcard,
        partition: partitionNumber,
      }),
    );

const addFlashcardInPartition1 = addFlashcardsInPartition(1);
const addFlashcardInPartition2 = addFlashcardsInPartition(2);
const addFlashcardInPartition3 = addFlashcardsInPartition(3);
const addFlashcardInPartition4 = addFlashcardsInPartition(4);
const addFlashcardInPartition5 = addFlashcardsInPartition(5);
const addFlashcardInPartition6 = addFlashcardsInPartition(6);
const addFlashcardInPartition7 = addFlashcardsInPartition(7);

export const setInitialFixture = async (
  boxRepository: BoxRepository,
  authenticationGateway: AuthenticationGateway,
) => {
  await authenticationGateway.authenticate(Player({ id: '42' }));
  const box1OwnedByPlayer42 = mapBox(
    ...addFlashcardInPartition1(5),
    ...addFlashcardInPartition2(5),
    ...addFlashcardInPartition3(5),
    ...addFlashcardInPartition4(5),
    ...addFlashcardInPartition5(5),
    ...addFlashcardInPartition6(5),
    ...addFlashcardInPartition7(5),
  )(
    Box({
      name: 'box1',
      playerId: '42',
      archivedFlashcards: Set<Flashcard>(Range(0, 5).map(createFlashcard)),
    }),
  );
  const box2OwnedByPlayer42 = mapBox(
    ...addFlashcardInPartition1(5),
    ...addFlashcardInPartition2(10),
    ...addFlashcardInPartition3(3),
    ...addFlashcardInPartition4(4),
  )(
    Box({
      name: 'box2',
      playerId: '42',
      archivedFlashcards: Set<Flashcard>(Range(0, 3).map(createFlashcard)),
    }),
  );
  const box1OwnedByPlayer41 = mapBox(
    ...addFlashcardInPartition1(5),
    ...addFlashcardInPartition2(5),
    ...addFlashcardInPartition3(5),
    ...addFlashcardInPartition4(5),
    ...addFlashcardInPartition5(5),
    ...addFlashcardInPartition6(5),
    ...addFlashcardInPartition7(5),
  )(
    Box({
      name: 'box1',
      playerId: '41',
      archivedFlashcards: Set<Flashcard>(Range(0, 5).map(createFlashcard)),
    }),
  );
  await Promise.all([
    boxRepository.save(box1OwnedByPlayer42),
    boxRepository.save(box2OwnedByPlayer42),
    boxRepository.save(box1OwnedByPlayer41),
  ]);
};
