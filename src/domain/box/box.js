const invariant = require('invariant');
const { uniq, range } = require('lodash');
const { Flashcard } = require('./flashcard');
const { Player } = require('../player/player');
const { Partition } = require('./partitions');
const { createSessionDeckForPartitions } = require('./sessionDeckService/createSessionDeckForPartitions');

const getPartitionsForCurrentSession = ({ currentSession, lastCompletedSession }) =>
  range(lastCompletedSession + 1, currentSession + 1);

/**
 *
 * @param {Object} params
 * @param {string} params.name
 * @param {string} params.playerId
 * @param {[Partition]} params.partitions
 * @param {number} params.nextSession
 */
const Box = ({
  name,
  playerId,
  partitions = [[], [], [], [], [], [], []],
  nextSession = 1,
  lastCompletedSession = 0,
} = {}) => {
  const createSessionDeck = createSessionDeckForPartitions(partitions);
  const sessionDeck = createSessionDeck({ lastCompletedSession, session: nextSession });

  return Object.freeze({
    named(aName = String()) {
      return Box({ name: aName, playerId, partitions, nextSession, lastCompletedSession });
    },
    ownedBy(aPlayer = Player) {
      return Box({ name, playerId: aPlayer.id, partitions, nextSession, lastCompletedSession });
    },
    whereTheNextSessionToBePlayedIs(theNextSession = 0) {
      return Box({
        name,
        playerId,
        partitions,
        nextSession: parseInt(theNextSession, 10),
        lastCompletedSession,
      });
    },
    withLastCompletedSessionBeing(theLastCompletedSession = 0) {
      return Box({
        name,
        playerId,
        partitions,
        nextSession,
        lastCompletedSession: parseInt(theLastCompletedSession, 10),
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
            name,
            playerId,
            partitions: Object.values({
              ...partitions,
              [partition - 1]: [...partitions[partition - 1], flashcard],
            }),
            nextSession,
            lastCompletedSession,
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
      return partitionsNumber.reduce((flashcards, number) => [...flashcards, ...partitions[number - 1]], []);
    },
    playerId,
    name,
    partitions,
    nextSession,
    sessionDeck,
    lastCompletedSession,
  });
};

module.exports = {
  Box: Box(),
};
