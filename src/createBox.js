const createBox = ({ name = '', partitions = [[], [], [], [], []] } = {}) => {
  if (!name) {
    throw new Error('missing properties "name"');
  }
  if (!Array.isArray() && partitions.length !== 5) {
    throw new Error('partitions should be an array of length 5');
  }
  return Object.freeze({
    name,
    partitions,
  });
};

module.exports = {
  createBox,
};
