import { Record, OrderedSet, Set, Stack } from 'immutable';
import dayjs from 'dayjs';
import identity from 'lodash/identity';
import flow from 'lodash/flow';
import { Flashcard } from './flashcard';
import { Partitions, PartitionNumber, addFlashcardInPartition, mapPartitions } from './partitions';
import { getPartitionsForSession } from './sessionDeckService/getPartitionsForSession';
export type SessionFlashcard = { flashcard: Flashcard; fromPartition: PartitionNumber };

export type SessionFlashcardSet = Stack<SessionFlashcard>;

export type BoxProps = {
  name?: string;
  playerId?: string;
  startedAt?: Date;
  lastStartedSessionDate?: Date;
  partitions: Partitions;
  sessionsPartitions: PartitionNumber[];
  sessionFlashcards: SessionFlashcardSet;
  sessionScore: number;
  archivedFlashcards: Set<Flashcard>;
};

export const Box = Record<BoxProps>({
  name: undefined,
  playerId: undefined,
  startedAt: undefined,
  lastStartedSessionDate: undefined,
  partitions: mapPartitions(identity)(),
  sessionsPartitions: [],
  sessionFlashcards: Stack<SessionFlashcard>(),
  sessionScore: 0,
  archivedFlashcards: Set<Flashcard>(),
});

export type Box = ReturnType<typeof Box>;

export const mapBox = (...updaters: ((box: Box) => Box)[]) => (box = Box()): Box => flow(updaters)(box);

const setSessionStartedAtIfNotStartedBefore = (sessionDate: Date) => (box: Box): Box =>
  box.update('startedAt', startedAt => (typeof startedAt === 'undefined' ? sessionDate : startedAt));

const setSessionsPartitions = (sessionDate: Date) => (box: Box): Box => {
  return box.set(
    'sessionsPartitions',
    getPartitionsForSession({
      dateOfFirstSession: box.startedAt,
      sessionDate,
      lastStartedSessionDate: box.lastStartedSessionDate,
    }),
  );
};

const updateLastSessionStartedAt = (sessionDate: Date) => (box: Box): Box =>
  box.set('lastStartedSessionDate', sessionDate);

const incrementSessionScore = (box: Box): Box => box.update('sessionScore', sessionScore => sessionScore + 1);

const archiveFlashcard = (flashcard: Flashcard) => (box: Box): Box =>
  box.update('archivedFlashcards', archivedFlashcard => archivedFlashcard.add(flashcard));

const moveCurrentlyReviewedFlashcardToItsNextPartition = (box: Box): Box => {
  const sessionFlashcard: SessionFlashcard = box.sessionFlashcards.first();
  if (sessionFlashcard.fromPartition === 7) {
    return archiveFlashcard(sessionFlashcard.flashcard)(box);
  }
  return box.update(
    'partitions',
    addFlashcardInPartition({
      partition: (sessionFlashcard.fromPartition + 1) as PartitionNumber,
      flashcard: sessionFlashcard.flashcard,
    }),
  );
};

const moveCurrentlyReviewedFlashcardToTheFirstPartition = (box: Box): Box => {
  const sessionFlashcard: SessionFlashcard = box.sessionFlashcards.first();
  return box.update(
    'partitions',
    addFlashcardInPartition({ flashcard: sessionFlashcard.flashcard, partition: 1 }),
  );
};

const pickNextFlashcardToReview = (box: Box): Box =>
  box.update('sessionFlashcards', sessionFlashcards => sessionFlashcards.rest());

const getFlashcardsFromPartitions = ({
  partitions,
  box,
}: {
  partitions: PartitionNumber[];
  box: Box;
}): Stack<SessionFlashcard> =>
  Stack(partitions).flatMap(fromPartition =>
    box.partitions.get(fromPartition).map(flashcard => ({
      flashcard,
      fromPartition,
    })),
  );

const setSessionFlashcardsFromSessionsPartitions = (box: Box): Box =>
  box.set('sessionFlashcards', getFlashcardsFromPartitions({ partitions: box.sessionsPartitions, box }));

const emptyBoxPartition = (partition: PartitionNumber) => (box: Box): Box =>
  box.setIn(['partitions', partition], OrderedSet<Flashcard>());

const removeSessionFlashcardsFromTheirPartitions = (sessionPartitions: Box['sessionsPartitions']) =>
  mapBox(...sessionPartitions.map(emptyBoxPartition));

const pickSelectedFlashcards = (box: Box): Box =>
  mapBox(
    setSessionFlashcardsFromSessionsPartitions,
    removeSessionFlashcardsFromTheirPartitions(box.sessionsPartitions),
  )(box);

const moveBackInTheirPartitionsFlashcardsFromPreviousSession = (box: Box): Box =>
  mapBox(
    ...box.sessionFlashcards.map(sessionFlashcard =>
      addFlashcard({
        flashcard: sessionFlashcard.flashcard,
        partition: sessionFlashcard.fromPartition,
      }),
    ),
  )(box);

export const addFlashcard = ({
  flashcard,
  partition,
}: {
  flashcard: Flashcard;
  partition: PartitionNumber;
}) => (box: Box): Box => box.update('partitions', addFlashcardInPartition({ partition, flashcard }));

export const startSession = (sessionDate: Date) => (box: Box): Box => {
  return dayjs(box.lastStartedSessionDate).isSame(dayjs(sessionDate))
    ? box
    : mapBox(
        moveBackInTheirPartitionsFlashcardsFromPreviousSession,
        setSessionStartedAtIfNotStartedBefore(sessionDate),
        setSessionsPartitions(sessionDate),
        pickSelectedFlashcards,
        updateLastSessionStartedAt(sessionDate),
      )(box);
};

export const notifyGoodAnswer = mapBox(
  incrementSessionScore,
  moveCurrentlyReviewedFlashcardToItsNextPartition,
  pickNextFlashcardToReview,
);

export const notifyWrongAnswer = mapBox(
  moveCurrentlyReviewedFlashcardToTheFirstPartition,
  pickNextFlashcardToReview,
);
