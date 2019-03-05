const uuid = require('uuid/v1');
const { FlashCards } = require('../flashCards');

const getDb = async ({ boxes, previousSessionNumber }) => {
  if (!process.env.TEST_MODE || process.env.TEST_MODE === 'unit') {
    const { InMemoryBoxesDb } = require('../inMemory/boxesDb');
    return InMemoryBoxesDb(boxes, previousSessionNumber);
  }
  const { FirebaseBoxesDb } = require('../firebase/boxesDb');
  const boxesId = uuid();
  const db = FirebaseBoxesDb(boxesId);
  await Promise.all(
    boxes.map((box, index) =>
      box.map(card =>
        db.addCardInBox({
          boxNumber: index + 1,
          card,
        }),
      ),
    ),
  );
  await db.setPreviousSessionNumber(previousSessionNumber);
  return db;
};

const TestFlashCards = async ({ boxes, previousSessionNumber }) => {
  const db = await getDb({ boxes, previousSessionNumber });
  return {
    ...FlashCards(db),
    getBoxes: db.getBoxes,
  };
};

const c1 = { id: 'c1' };
const c2 = { id: 'c2' };
const c3 = { id: 'c3' };
const c4 = { id: 'c4' };
const c5 = { id: 'c5' };

module.exports = {
  TestFlashCards,
  c1,
  c2,
  c3,
  c4,
  c5,
};
