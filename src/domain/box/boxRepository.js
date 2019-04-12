const { Box } = require('./box');
const { Flashcard } = require('./flashcard');

/* eslint-disable no-unused-vars */
const BoxRepository = ({
  save = async (box = Box) => Boolean(),
  getBoxByName = async ({ boxName = String(), playerId = String() } = {}) => Box,
  getCurrentSessionDeckForBox = async ({ boxName = String(), playerId = String() } = {}) => [Flashcard],
} = {}) =>
  Object.freeze({
    save,
    getBoxByName,
    getCurrentSessionDeckForBox,
  });

module.exports = {
  BoxRepository,
};
