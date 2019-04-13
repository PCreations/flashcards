import { Before } from 'cucumber';
import { Dependencies } from '../../testsUtils/dependencies';
import { Player } from '../../src/domain/player/player';

Before(async function() {
  const { authenticationGateway, boxRepository } = this.dependenciesPath;
  const {
    AuthenticationGateway,
  }: {
    AuthenticationGateway: () => Dependencies['authenticationGateway'];
  } = await import(`../../${authenticationGateway}`);
  const {
    BoxRepository,
  }: { BoxRepository: () => Dependencies['boxRepository'] } = await import(`../../${boxRepository}`);
  this.dependencies = {
    authenticationGateway: AuthenticationGateway(),
    boxRepository: BoxRepository(),
  };
});

Before({ tags: '@loggedIn' }, function() {
  const { authenticationGateway } = this.dependencies;
  return authenticationGateway.authenticate(Player.ofId('42'));
});
