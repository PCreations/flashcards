const create = boxMap => ({ playerId, box }) => {
  boxMap[playerId] = [...(boxMap[playerId] || []), box];
  return Promise.resolve();
};

module.exports = {
  create,
};
