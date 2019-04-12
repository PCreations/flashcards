const invariant = require('invariant');
const { Flashcard } = require('./flashcard');
const { Player } = require('../player/player');
const { Partition } = require('./partitions');
const { createSessionDeckForPartitions } = require('./sessionDeckService/createSessionDeckForPartitions');

/**
 *
 * @param {Object} params
 * @param {string} params.name
 * @param {string} params.playerId
 * @param {[Partition]} params.partitions
 * @param {number} params.nextSession
 */
const Box = (
  params = {
    name: '',
    playerId: '',
    partitions: [[], [], [], [], [], [], []],
    nextSession: 1,
    lastCompletedSession: 0,
  },
) => {
  const createSessionDeck = createSessionDeckForPartitions(params.partitions);
  const sessionDeck = createSessionDeck({
    lastCompletedSession: params.lastCompletedSession,
    session: params.nextSession,
  });

  return Object.freeze({
    named(name = String()) {
      return Box({ ...params, name });
    },
    ownedBy(player = Player) {
      return Box({ ...params, playerId: player.id });
    },
    whereTheNextSessionToBePlayedIs(nextSession = 0) {
      return Box({
        ...params,
        nextSession: parseInt(nextSession, 10),
      });
    },
    withLastCompletedSessionBeing(lastCompletedSession = 0) {
      return Box({
        ...params,
        lastCompletedSession: parseInt(lastCompletedSession, 10),
      });
    },
    addFlashcard(flashcard = Flashcard) {
      return {
        inPartition(partition = 1) {
          invariant(typeof partition === typeof 1, 'partition number must be a number');
          invariant(
            partition >= 1 && partition <= 7,
            `partition number should be between 1 and 7, received ${partition}`,
          );
          return Box({
            ...params,
            partitions: Object.values({
              ...params.partitions,
              [partition - 1]: [...params.partitions[partition - 1], flashcard],
            }),
          });
        },
      };
    },
    /**
     *
     * @param  {...number} partitionsNumber
     * @returns {[Flashcard]}
     */
    getFlashcardsInPartitions(...partitionsNumber) {
      return partitionsNumber.reduce(
        (flashcards, number) => [...flashcards, ...params.partitions[number - 1]],
        [],
      );
    },
    sessionDeck,
    ...params,
  });
};

module.exports = {
  Box: Box(),
};
