import { Player } from './player';

export const AuthenticationGateway = ({
  authenticate,
  getCurrentPlayer,
}: {
  authenticate: (player: Player) => Promise<boolean>;
  getCurrentPlayer: () => Player;
}) =>
  Object.freeze({
    authenticate,
    getCurrentPlayer,
  });

export type AuthenticationGateway = ReturnType<typeof AuthenticationGateway>;
