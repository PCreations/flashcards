import { Map, OrderedSet } from 'immutable';
import { Flashcard } from './flashcard';
import flow from 'lodash/flow';

export type PartitionNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Partitions = Map<PartitionNumber, OrderedSet<Flashcard>>;

const defaultPartitions: Partitions = Map<PartitionNumber, OrderedSet<Flashcard>>().withMutations(
  partitions =>
    partitions
      .set(1, OrderedSet<Flashcard>())
      .set(2, OrderedSet<Flashcard>())
      .set(3, OrderedSet<Flashcard>())
      .set(4, OrderedSet<Flashcard>())
      .set(5, OrderedSet<Flashcard>())
      .set(6, OrderedSet<Flashcard>())
      .set(7, OrderedSet<Flashcard>()),
);

export const mapPartitions = (...fns: ((partitions: Partitions) => Partitions)[]) => (
  partitions = defaultPartitions,
): Partitions => flow(fns)(partitions);

export const getPartitionsArray = (partitions: Partitions): Flashcard[][] =>
  partitions
    .toList()
    .map(flashcards => flashcards.toArray())
    .toArray();

export const addFlashcardInPartition = ({
  partition,
  flashcard,
}: {
  partition: PartitionNumber;
  flashcard: Flashcard;
}) => (partitions: Partitions): Partitions =>
  partitions.update(partition, flashcards => flashcards.add(flashcard));
