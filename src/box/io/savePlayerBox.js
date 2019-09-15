const { create: createGetPlayerBoxByName } = require('./getPlayerBoxByName');

const create = boxMap => {
  const getPlayerBoxByName = createGetPlayerBoxByName(boxMap);
  return async ({ playerId, box }) => {
    let boxExists = false;
    try {
      await getPlayerBoxByName({ boxName: box.name, playerId });
      boxExists = true;
    } catch {}
    boxMap[playerId] = boxMap[playerId] || [];
    boxMap[playerId] = boxExists
      ? boxMap[playerId].filter(b => b.name !== box.name).concat(box)
      : boxMap[playerId].concat(box);
  };
};

module.exports = {
  create,
};
