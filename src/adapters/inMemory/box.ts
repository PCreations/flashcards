import { GetBoxByNameAndPlayerId, SaveBox, GetAllBoxesOwnedBy } from '../../domain/box/repository';
import { Box } from '../../domain/box/box';

export const createAdapters = (): {
  getBoxByNameAndPlayerId: GetBoxByNameAndPlayerId;
  saveBox: SaveBox;
  getAllBoxesOwnedBy: GetAllBoxesOwnedBy;
} => {
  const boxes: { [id: string]: Box } = {};
  const boxesByPlayerId: { [id: string]: Box[] } = {};
  return {
    async getBoxByNameAndPlayerId({ boxName, playerId }) {
      return boxes[`${playerId}-${boxName}`];
    },
    async saveBox(box) {
      boxes[`${box.playerId}-${box.name}`] = box;
      boxesByPlayerId[box.playerId] = (boxesByPlayerId[box.playerId] || []).concat(box);
      return true;
    },
    async getAllBoxesOwnedBy(playerId) {
      return boxesByPlayerId[playerId];
    },
  };
};
