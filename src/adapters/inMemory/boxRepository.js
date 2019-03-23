const { BoxRepository } = require('../../domain/box/boxRepository');

const InMemoryBoxRepository = () => {
  const boxes = {};
  return BoxRepository({
    async save(box) {
      boxes[`${box.playerId}-${box.name}`] = box;
    },
    async getBoxByName({ boxName, playerId }) {
      return boxes[`${playerId}-${boxName}`];
    },
  });
};

module.exports = {
  BoxRepository: InMemoryBoxRepository,
};
