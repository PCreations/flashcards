const { Box } = require('./box');
const { Player } = require('../player/player');

const BoxRepository = ({
  save = async (box = Box) => Boolean(),
  getBoxByName = async ({ boxName = String(), playerId = String() } = {}) => Box,
} = {}) =>
  Object.freeze({
    save,
    getBoxByName,
  });

module.exports = {
  BoxRepository,
};
