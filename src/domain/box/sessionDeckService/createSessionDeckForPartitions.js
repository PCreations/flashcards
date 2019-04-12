const { flow, flatMap } = require('lodash/fp');
const { getPartitionsNumbers } = require('./getPartitionsNumbers');

const createSessionDeckForPartitions = partitions => ({ lastCompletedSession, session }) =>
  flow(
    getPartitionsNumbers,
    flatMap(partitionNumber => partitions[partitionNumber - 1]),
  )({ lastCompletedSession, session });

module.exports = {
  createSessionDeckForPartitions,
};
