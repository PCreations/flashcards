const createBox = ({ name = '' } = {}) => {
  if (!name) {
    throw new Error('missing properties "name"');
  }
  return Object.freeze({
    name,
    partitions: [[], [], [], [], []],
  });
};

module.exports = {
  createBox,
};
