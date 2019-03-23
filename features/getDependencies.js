const { BoxRepository } = require('../src/domain/box/boxRepository');
const { AuthenticationGateway } = require('../src/domain/player/authenticationGateway');

const getDependencies = ({
  dependencies: { boxRepository = BoxRepository(), authenticationGateway = AuthenticationGateway() },
} = {}) =>
  Object.freeze({
    boxRepository,
    authenticationGateway,
  });

module.exports = {
  getDependencies,
};
