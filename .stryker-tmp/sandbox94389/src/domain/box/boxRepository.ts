import { Box } from './box';
import { Player } from '../player/player';

export const BoxRepository = ({
  save,
  getBoxByName,
  getAllBoxOwnedBy,
}: {
  save: (box: Box) => Promise<boolean>;
  getBoxByName: ({ boxName, playerId }: { boxName: string; playerId: string }) => Promise<Box>;
  getAllBoxOwnedBy: (playerId: Player['id']) => Promise<Box[]>;
}) =>
  Object.freeze({
    save,
    getBoxByName,
    getAllBoxOwnedBy,
  });

export type BoxRepository = ReturnType<typeof BoxRepository>;
