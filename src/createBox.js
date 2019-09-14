const createBox = ({ name = '' } = {}) => {
  if (!name) {
    throw new Error('missing properties "name"');
  }
};

module.exports = {
  createBox,
};
