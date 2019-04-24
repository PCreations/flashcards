import flatMap from 'lodash/flatMap';
import flow from 'lodash/flow';
import { Player } from '../player/player';
import { Flashcard } from './flashcard';
import {
  Partitions,
  PartitionNumber,
  moveFlashcardToItsNextPartition,
  moveFlashcardToPartition,
  addFlashcardInPartition,
} from './partitions';
import { getPartitionsForSession } from './sessionDeckService/getPartitionsForSession';

export type FlashcardPositionInBox = Readonly<{
  partition: PartitionNumber;
  position: number;
}>;

export type Box = Readonly<{
  name?: string;
  playerId?: string;
  startedAt?: Date;
  lastStartedSessionDate?: Date;
  partitions: Partitions;
  sessionsPartitions: PartitionNumber[];
  sessionFlashcards: Partitions[keyof Partitions];
  sessionScore: number;
  archivedFlashcards: Partitions[keyof Partitions];
}>;

const defaultBox: Box = Object.freeze({
  partitions: { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] },
  flashcardsByQuestion: {},
  sessionsPartitions: [],
  sessionFlashcards: [],
  sessionScore: 0,
  archivedFlashcards: [],
});

const mergeBox = (updater: (box: Box) => Partial<Box>) => (box: Box): Box =>
  Object.freeze({
    ...box,
    ...updater(box),
  });

const updateSessionStartedAt = (sessionDate: Date) =>
  mergeBox(box => whereFirstSessionStartedAt(box.startedAt || sessionDate)(box));

const updateSessionsPartitions = (sessionDate: Date) =>
  mergeBox(box => ({
    sessionsPartitions: getPartitionsForSession({
      dateOfFirstSession: box.startedAt,
      sessionDate,
      lastStartedSessionDate: box.lastStartedSessionDate,
    }),
  }));

const pickSelectedQuestions = mergeBox(box => ({
  sessionFlashcards: flatMap(box.sessionsPartitions, partitionNumber => box.partitions[partitionNumber]),
}));

const updateLastSessionStartedAt = (sessionDate: Date) =>
  mergeBox(() => ({ lastStartedSessionDate: sessionDate }));

const incrementSessionScore = mergeBox(box => ({ sessionScore: box.sessionScore + 1 }));

const archiveFlashcard = (flashcard: Flashcard) =>
  mergeBox(box => ({
    archivedFlashcards: box.archivedFlashcards.concat(flashcard),
  }));

const moveCurrentlyReviewedFlashcardToTheNextPartition = mergeBox(box => {
  const flashcard = box.sessionFlashcards[0];
  try {
    return {
      partitions: moveFlashcardToItsNextPartition({
        flashcard,
      })(box.partitions),
    };
  } catch (e) {
    return archiveFlashcard(flashcard)(box);
  }
});

const moveCurrentlyReviewedFlashcardToTheFirstPartition = mergeBox(box => ({
  partitions: moveFlashcardToPartition({ flashcard: box.sessionFlashcards[0], destPartition: 1 })(
    box.partitions,
  ),
}));

const pickNextFlashcardToReview = mergeBox(box => ({
  sessionFlashcards: box.sessionFlashcards.slice(1, box.sessionFlashcards.length),
}));

export const createBox = (...fns: ((box: Box) => Box)[]): Box => flow(fns)(defaultBox);

export const named = (name: string) => mergeBox(() => ({ name }));

export const ownedBy = (player: Player) => mergeBox(() => ({ playerId: player.id }));

export const whereFirstSessionStartedAt = (startedAt: Date) => mergeBox(() => ({ startedAt }));

export const addFlashcard = ({
  flashcard,
  partition,
}: {
  flashcard: Flashcard;
  partition: PartitionNumber;
}) =>
  mergeBox(box => ({
    partitions: addFlashcardInPartition({ partition, flashcard })(box.partitions),
  }));

export const startSession = (sessionDate: Date) =>
  flow(
    updateSessionStartedAt(sessionDate),
    updateSessionsPartitions(sessionDate),
    pickSelectedQuestions,
    updateLastSessionStartedAt(sessionDate),
  );

export const notifyGoodAnswer = flow(
  incrementSessionScore,
  moveCurrentlyReviewedFlashcardToTheNextPartition,
  pickNextFlashcardToReview,
);

export const notifyWrongAnswer = flow(
  moveCurrentlyReviewedFlashcardToTheFirstPartition,
  pickNextFlashcardToReview,
);

export const getFlashcardsInPartitions = ({
  box,
  partitionsNumbers,
}: {
  box: Box;
  partitionsNumbers: PartitionNumber[];
}): Flashcard[] => flatMap(partitionsNumbers, partition => box.partitions[partition]);
