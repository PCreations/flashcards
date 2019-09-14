const { createBox } = require('../../');
const getPlayerBoxByName = require('../getPlayerBoxByName');

describe('getPlayerBoxByName.create', () => {
  test('creates a default in memory implementation with no boxes', () => {
    const inMemoryGetPlayerBoxByName = getPlayerBoxByName.create();
    return expect(inMemoryGetPlayerBoxByName({ boxName: 'foo', playerId: 'bar' })).rejects.toThrowError(
      'box not found',
    );
  });
  test('given somes boxes, can retrieve the correct box for a given player', () => {
    const boxes = {
      player1: [createBox({ name: 'box1' }), createBox({ name: 'box2' })],
      player2: [createBox({ name: 'box1' }), createBox({ name: 'box3' })],
    };
    const inMemoryGetPlayerBoxByName = getPlayerBoxByName.create(boxes);
    return expect(inMemoryGetPlayerBoxByName({ boxName: 'box1', playerId: 'player1' })).resolves.toEqual(
      boxes.player1[0],
    );
  });
});
