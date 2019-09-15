const create = (boxes = {}) => ({ boxName = '', playerId = '' } = {}) => {
  const playerBoxes = boxes[playerId] || [];
  const box = playerBoxes.find(box => box.name === boxName);
  return box === undefined ? Promise.reject(new Error('box not found')) : Promise.resolve(box);
};

module.exports = {
  create,
};
