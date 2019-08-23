import { Authenticate, GetCurrentPlayerId } from '../../domain/player/authentication';
import { Player } from '../../domain/player/player';

export const createAdapters = (): { authenticate: Authenticate; getCurrentPlayerId: GetCurrentPlayerId } => {
  let currentPlayer: Player;
  const authenticate: Authenticate = async player => {
    currentPlayer = player;
    return true;
  };
  const getCurrentPlayerId: GetCurrentPlayerId = () => currentPlayer.id;
  return {
    authenticate,
    getCurrentPlayerId,
  };
};
