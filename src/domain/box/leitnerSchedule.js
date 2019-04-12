const partition = (partitionNumber, { startAt, interval }, session) =>
  session % interval === startAt ? partitionNumber : null;

const leitnerSchedule = session =>
  [1]
    .concat(partition(2, { startAt: 1, interval: 2 }, session))
    .concat(partition(3, { startAt: 2, interval: 4 }, session))
    .concat(partition(4, { startAt: 4, interval: 16 }, session))
    .concat(partition(4, { startAt: 13, interval: 16 }, session))
    .concat(partition(5, { startAt: 12, interval: 16 }, session))
    .concat(partition(6, { startAt: 24, interval: 35 }, session))
    .concat(partition(7, { startAt: 56, interval: 64 }, session))
    .filter(maybeNull => maybeNull !== null)
    .sort((a, b) => parseInt(b, 10) - parseInt(a, 10));

module.exports = {
  leitnerSchedule,
};
