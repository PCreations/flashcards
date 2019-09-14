const savePlayerBox = require('../savePlayerBox');
const { createBox } = require('../../');

describe('savePlayerBox.create', () => {
  test('creates a default implementation that save box in the given in-memory map', async () => {
    const boxMap = {};
    const theBoxToSave = createBox({ name: 'some box' });
    const inMemorySavePlayerBox = savePlayerBox.create(boxMap);
    await inMemorySavePlayerBox({ playerId: 'player1', box: theBoxToSave });
    expect(boxMap.player1).toContainEqual(theBoxToSave);
  });
});
