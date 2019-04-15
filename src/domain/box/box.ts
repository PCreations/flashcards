import invariant from 'invariant';
import { Player } from '../player/player';
import { Flashcard } from './flashcard';
import { Partitions, PartitionNumber } from './partitions';
import { SessionNumber, NO_COMPLETED_SESSION_YET } from './sessionNumber';
import { createSessionDeckForPartitions } from './sessionDeckService/createSessionDeckForPartitions';

const BoxFactory = (
  data: {
    name?: string;
    playerId?: string;
    startedAt?: Date;
    partitions: Partitions;
    lastCompletedSessionDate?: Date;
    sessionDeck?: Flashcard[];
  } = {
    partitions: { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] },
  },
) => {
  const createSessionDeck = createSessionDeckForPartitions(data.partitions);

  return Object.freeze({
    named(name: string) {
      return BoxFactory({ ...data, name });
    },
    ownedBy(player: Player) {
      return BoxFactory({ ...data, playerId: player.id });
    },
    whereFirstSessionStartedAt(startedAt: Date) {
      return BoxFactory({ ...data, startedAt });
    },
    startSession(sessionDate: Date) {
      return BoxFactory({
        ...data,
        startedAt: data.startedAt || sessionDate,
        sessionDeck: createSessionDeck({
          dateOfFirstSession: data.startedAt || sessionDate,
          sessionDate,
          lastCompletedSessionDate: data.lastCompletedSessionDate,
        }),
      });
    },
    addFlashcard(flashcard: Flashcard) {
      return {
        inPartition(partition: PartitionNumber = 1) {
          invariant(typeof partition === typeof 1, 'partition number must be a number');
          invariant(
            partition >= 1 && partition <= 7,
            `partition number should be between 1 and 7, received ${partition}`,
          );
          return BoxFactory({
            ...data,
            partitions: {
              ...data.partitions,
              [partition]: [...data.partitions[partition], flashcard],
            },
          });
        },
      };
    },
    getFlashcardsInPartitions(...partitionsNumber: PartitionNumber[]) {
      return partitionsNumber.reduce((flashcards, number) => [...flashcards, ...data.partitions[number]], []);
    },
    sessionDeck: [],
    ...data,
  });
};

export const Box = BoxFactory();

export type Box = ReturnType<typeof BoxFactory>;
