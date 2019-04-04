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
    async getCurrentSessionDeckForBox({ boxName, playerId }) {
      return [
        { id: 'aaa', question: "What's the capital of France ?", answer: 'Paris' },
        { id: 'bbb', question: "What's the capital of Italy ?", answer: 'Roma' },
        { id: 'ccc', question: "What's the capital of the Netherlands ?", answer: 'Amsterdam' },
        { id: 'ddd', question: "What's the capital of Norway ?", answer: 'Oslo' },
        { id: 'eee', question: "What's the capital of Croatia ?", answer: 'Zagreb' },
      ];
    },
  });
};

module.exports = {
  BoxRepository: InMemoryBoxRepository,
};
