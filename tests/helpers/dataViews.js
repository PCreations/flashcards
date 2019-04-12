const { Box } = require('../../src/domain/box/box');

/**
 *
 * @param {Object} params
 * @param {Box} params.box
 * @param {[number]} params.partitions
 */
const flashcardsInPartitions = ({ box, partitions } = {}) =>
  box.getFlashcardsInPartitions(...partitions).map(({ id, question, answer }) => ({ id, question, answer }));

/**
 *
 * @param {Object} params
 * @param {Box} params.box
 */
const flashcardsInDeck = ({ deck } = {}) =>
  deck.map(({ id, question, answer }) => ({ id, question, answer }));

module.exports = {
  flashcardsInPartitions,
  flashcardsInDeck,
};
