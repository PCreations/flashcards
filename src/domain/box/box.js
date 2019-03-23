const { Flashcard } = require('./flashcard');
const { Player } = require('../player/player');

const Box = ({ name = String(), playerId = String(), partitions = [[]] } = {}) =>
  Object.freeze({
    named(aName = String()) {
      return Box({ name: aName, playerId, partitions });
    },
    ownedBy(aPlayer = Player) {
      return Box({ name, playerId: aPlayer.id, partitions });
    },
    withPartition(partition) {
      return {
        containing(flashcards) {
          return Box({ name, playerId, partitions: [flashcards] });
        },
      };
    },
    addFlashcard(flashcard = Flashcard) {
      return {
        inPartition(partition) {
          return Box({ name, playerId, partitions: [[...partitions[0], flashcard]] });
        },
      };
    },
    getFlashcardsInPartition(partitionNumber) {
      return partitions[0];
    },
    playerId,
    name,
    partitions,
  });

module.exports = {
  Box: Box(),
};
