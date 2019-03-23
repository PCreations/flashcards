const Player = ({ id = String() } = {}) => ({
  ofId(anId) {
    return Player({ id: anId });
  },
  id,
});

module.exports = {
  Player: Player(),
};
