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
    partitions: Partitions;
    currentSession: SessionNumber;
    lastCompletedSession: SessionNumber;
  } = {
    partitions: { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] },
    currentSession: NO_COMPLETED_SESSION_YET,
    lastCompletedSession: NO_COMPLETED_SESSION_YET,
  },
) => {
  const createSessionDeck = createSessionDeckForPartitions(data.partitions);
  const sessionDeck = createSessionDeck({
    lastCompletedSession: data.lastCompletedSession,
    session: data.currentSession,
  });

  return Object.freeze({
    named(name: string) {
      return BoxFactory({ ...data, name });
    },
    ownedBy(player: Player) {
      return BoxFactory({ ...data, playerId: player.id });
    },
    startSession() {
      return BoxFactory({
        ...data,
        currentSession: (data.currentSession + 1) as SessionNumber,
        lastCompletedSession: data.currentSession,
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
    sessionDeck,
    ...data,
  });
};

export const Box = BoxFactory();

export type Box = ReturnType<typeof BoxFactory>;
