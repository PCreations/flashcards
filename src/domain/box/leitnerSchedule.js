const leitnerSchedule = partition =>
  [1]
    .concat(partition % 2 === 1 ? [2] : [])
    .concat(partition % 4 === 2 ? [3] : [])
    .concat(partition % 16 === 4 || partition % 16 === 13 ? [4] : [])
    .concat(partition % 16 === 12 ? [5] : [])
    .concat(partition % 35 === 24 ? [6] : [])
    .concat(partition === 56 ? [7] : [])
    .sort((a, b) => parseInt(a, 10 - parseInt(b, 10)));

module.exports = {
  leitnerSchedule,
};
