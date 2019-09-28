const { createStep } = require('../createStep');

module.exports = {
  ...createStep('the current player id is (.*)', ({ setCurrentPlayerId }) => playerId =>
    setCurrentPlayerId(playerId),
  ),
};
