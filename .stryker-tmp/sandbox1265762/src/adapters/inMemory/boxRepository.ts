import { BoxRepository as BaseBoxRepository } from '../../domain/box/boxRepository';
import { Box } from '../../domain/box/box';

export const BoxRepository = () => {
  const boxes: { [id: string]: Box } = {};
  const boxesByPlayerId: { [id: string]: Box[] } = {};
  return BaseBoxRepository({
    async save(box) {
      boxes[`${box.playerId}-${box.name}`] = box;
      boxesByPlayerId[box.playerId] = (boxesByPlayerId[box.playerId] || []).concat(box);
      return true;
    },
    async getBoxByName({ boxName, playerId }) {
      return boxes[`${playerId}-${boxName}`];
    },
    async getAllBoxOwnedBy(playerId) {
      return boxesByPlayerId[playerId];
    },
  });
};

export type BoxRepository = ReturnType<typeof BoxRepository>;
