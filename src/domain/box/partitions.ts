import { Flashcard } from './flashcard';
import flow from 'lodash/flow';
import mapValues from 'lodash/fp/mapValues';

export type PartitionNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Partitions = Readonly<{ [n in PartitionNumber]: Flashcard[] }>;

const defaultPartitions: Partitions = Object.freeze({ 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] });

export const createPartitions = (...fns: ((partitions: Partitions) => Partitions)[]): Partitions =>
  flow(fns)(defaultPartitions);

export const getPartitionsArray = (partitions: Partitions): Flashcard[][] =>
  Object.keys(partitions).map(
    partitionNumber => partitions[parseInt(partitionNumber, 10) as PartitionNumber],
  );

export const addFlashcardInPartition = ({
  partition,
  flashcard,
}: {
  partition: PartitionNumber;
  flashcard: Flashcard;
}) => (partitions: Partitions): Partitions =>
  Object.freeze({
    ...partitions,
    [partition]: partitions[partition].concat(flashcard),
  });

export const moveFlashcardToPartition = ({
  flashcard,
  destPartition,
}: {
  flashcard: Flashcard;
  destPartition: PartitionNumber;
}) =>
  flow(
    mapValues((flashcards: Flashcard[]) =>
      flashcards.filter(
        ({ answer, question }) => !(answer === flashcard.answer && question === flashcard.question),
      ),
    ),
    addFlashcardInPartition({ partition: destPartition, flashcard }),
  );

const getPartitionNumberOf = ({
  flashcard,
  partitions,
}: {
  flashcard: Flashcard;
  partitions: Partitions;
}) => {
  const flashcardPartitionStringNumber = Object.keys(partitions).find(partitionStringNumber => {
    const partitionNumber = parseInt(partitionStringNumber, 10) as PartitionNumber;
    return Boolean(
      ~partitions[partitionNumber].findIndex(
        ({ question, answer }) => question === flashcard.question && answer === flashcard.answer,
      ),
    );
  });
  return parseInt(flashcardPartitionStringNumber, 10) as PartitionNumber;
};

export const moveFlashcardToItsNextPartition = ({ flashcard }: { flashcard: Flashcard }) => (
  partitions: Partitions,
) => {
  const flashcardPartition = getPartitionNumberOf({ flashcard, partitions });
  if (flashcardPartition === 7) throw new Error();
  return moveFlashcardToPartition({
    flashcard,
    destPartition: (flashcardPartition + 1) as PartitionNumber,
  })(partitions);
};
