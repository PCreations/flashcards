const { Player } = require('./player');

const AuthenticationGateway = ({
  authenticate = async (player = Player) => Boolean(),
  getCurrentPlayer = () => Player,
}) =>
  Object.freeze({
    authenticate,
    getCurrentPlayer,
  });

module.exports = {
  AuthenticationGateway,
};
