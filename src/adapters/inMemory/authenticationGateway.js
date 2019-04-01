const { AuthenticationGateway } = require('../../domain/player/authenticationGateway');
const { Player } = require('../../domain/player/player');

const InMemoryAuthenticationGateway = () => {
  let currentPlayer = Player;
  return AuthenticationGateway({
    async authenticate(player) {
      currentPlayer = player;
      return true;
    },
    getCurrentPlayer() {
      return currentPlayer;
    },
  });
};

module.exports = {
  AuthenticationGateway: InMemoryAuthenticationGateway,
};
