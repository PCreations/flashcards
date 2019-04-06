const invariant = require('invariant');
const { Flashcard } = require('./flashcard');
const { Player } = require('../player/player');
const { Partition } = require('./partitions');

/**
 *
 * @param {Object} params
 * @param {string} params.name
 * @param {string} params.playerId
 * @param {[Partition]} params.partitions
 * @param {number} params.nextSession
 */
const Box = ({ name, playerId, partitions = [[], [], [], [], [], [], []], nextSession = 1 } = {}) => {
  return Object.freeze({
    named(aName = String()) {
      return Box({ name: aName, playerId, partitions });
    },
    ownedBy(aPlayer = Player) {
      return Box({ name, playerId: aPlayer.id, partitions });
    },
    whereTheNextSessionToBePlayedIs(theNextSession) {
      return Box({ name, playerId, partitions, nextSession: parseInt(theNextSession, 10) });
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
    sessionDeck: [
      { id: 'aaa', question: "What's the capital of France ?", answer: 'Paris' },
      { id: 'bbb', question: "What's the capital of Italy ?", answer: 'Roma' },
      { id: 'ccc', question: "What's the capital of the Netherlands ?", answer: 'Amsterdam' },
      { id: 'ddd', question: "What's the capital of Norway ?", answer: 'Oslo' },
      { id: 'eee', question: "What's the capital of Croatia ?", answer: 'Zagreb' },
    ],
  });
};

module.exports = {
  Box: Box(),
};
