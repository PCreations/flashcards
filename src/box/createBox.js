const createBox = ({ name = '', partitions = [[], [], [], [], []] } = {}) => {
  if (!name) {
    throw new Error('missing properties "name"');
  }
  if (!Array.isArray(partitions) || partitions.length !== 5) {
    throw new Error('partitions should be an array of length 5');
  }
  return Object.freeze({
    name,
    partitions,
    startedAt: null,
  });
};

module.exports = {
  createBox,
};
