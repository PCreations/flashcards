import flatMap from 'lodash/flatMap';
import flow from 'lodash/flow';
import { Player } from '../player/player';
import { Flashcard } from './flashcard';
import { Partitions, PartitionNumber } from './partitions';
import { getPartitionsForSession } from './sessionDeckService/getPartitionsForSession';

export type Box = Readonly<{
  name?: string;
  playerId?: string;
  startedAt?: Date;
  lastStartedSessionDate?: Date;
  partitions: Partitions;
  sessionsPartitions: PartitionNumber[];
}>;

const defaultBox: Box = Object.freeze({
  partitions: { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] },
  sessionsPartitions: [],
});

const mergeBox = (updater: (box: Box) => Partial<Box>) => (box: Box): Box =>
  Object.freeze({
    ...box,
    ...updater(box),
  });

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
    partitions: {
      ...box.partitions,
      [partition]: [...box.partitions[partition], flashcard],
    },
  }));

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

const updateLastSessionStartedAt = (sessionDate: Date) =>
  mergeBox(() => ({ lastStartedSessionDate: sessionDate }));

export const startSession = (sessionDate: Date) =>
  flow(
    updateSessionStartedAt(sessionDate),
    updateSessionsPartitions(sessionDate),
    updateLastSessionStartedAt(sessionDate),
  );

export const getFlashcard = ({
  box,
  partition,
  position,
}: {
  box: Box;
  partition: PartitionNumber;
  position: number;
}): Flashcard => box.partitions[partition][position - 1];

export const getFlashcardsInPartitions = ({
  box,
  partitionsNumbers,
}: {
  box: Box;
  partitionsNumbers: PartitionNumber[];
}): Flashcard[] => flatMap(partitionsNumbers, partition => box.partitions[partition]);
