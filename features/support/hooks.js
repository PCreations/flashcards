const { Before } = require('cucumber');
const { getDependencies } = require('../getDependencies');
const { Player } = require('../../src/domain/player/player');

Before({ tags: '@loggedIn' }, function() {
  const { authenticationGateway } = getDependencies(this);
  return authenticationGateway.authenticate(Player.ofId('42'));
});
