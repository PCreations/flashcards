import { Player } from '../player';

export type Authenticate = (player: Player) => Promise<boolean>;

export type GetCurrentPlayerId = () => string;
