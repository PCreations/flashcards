const savePlayerBox = require('../savePlayerBox');
const { createBox } = require('../../');
const { createFlashcard } = require('../../../createFlashcard');

describe('savePlayerBox.create', () => {
  test('creates a default implementation that save box in the given in-memory map', async () => {
    const boxMap = {};
    const inMemorySavePlayerBox = savePlayerBox.create(boxMap);
    const theBoxToSave = createBox({ name: 'some box' });
    await inMemorySavePlayerBox({ playerId: 'player1', box: theBoxToSave });
    expect(boxMap.player1).toContainEqual(theBoxToSave);
  });
  test('can updates an box stored in-memory', async () => {
    const boxMap = {};
    const inMemorySavePlayerBox = savePlayerBox.create(boxMap);
    const theBoxToSave = createBox({ name: 'some box' });
    await inMemorySavePlayerBox({ playerId: 'player1', box: theBoxToSave });

    const updatedBox = createBox({
      name: 'some box',
      partitions: [[createFlashcard({ answer: 'answer', question: 'question' })], [], [], [], []],
    });
    await inMemorySavePlayerBox({ playerId: 'player1', box: updatedBox });
    expect(boxMap.player1).not.toContainEqual(theBoxToSave);
    expect(boxMap.player1).toContainEqual(updatedBox);
  });
});
