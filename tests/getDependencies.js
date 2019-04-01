const { BoxRepository } = require('../src/domain/box/boxRepository');
const { AuthenticationGateway } = require('../src/domain/player/authenticationGateway');

const Dependencies = ({ boxRepository = BoxRepository(), authenticationGateway = AuthenticationGateway() }) =>
  Object.freeze({
    boxRepository,
    authenticationGateway,
  });

const getDependencies = dependencies =>
  Dependencies({
    boxRepository: require(`../${dependencies.boxRepository}`).BoxRepository(),
    authenticationGateway: require(`../${dependencies.authenticationGateway}`).AuthenticationGateway(),
  });

module.exports = {
  getDependencies,
};
