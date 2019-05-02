import { AuthenticationGateway as BaseAuthenticationGateway } from '../../domain/player/authenticationGateway';
import { Player } from '../../domain/player/player';

export const AuthenticationGateway = () => {
  let currentPlayer: Player;
  return BaseAuthenticationGateway({
    async authenticate(player) {
      currentPlayer = player;
      return true;
    },
    getCurrentPlayer() {
      return currentPlayer;
    },
  });
};

export type AuthenticationGateway = ReturnType<typeof AuthenticationGateway>;
