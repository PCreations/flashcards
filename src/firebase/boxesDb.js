const firebase = require('firebase');
const { API_KEY, PROJECT_ID } = require('./config');

firebase.initializeApp({
  apiKey: API_KEY,
  projectId: PROJECT_ID,
  authDomain: `${PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${PROJECT_ID}.firebaseio.com`,
  storageBucket: `${PROJECT_ID}.appspot.com`,
});

const db = firebase.firestore();

const FirebaseBoxesDb = cardBoxId => {
  return {
    getCardsFromBoxes(...boxNumbers) {
      const boxes = boxNumbers.map(boxNumber =>
        db
          .collection('card-boxes')
          .doc(cardBoxId)
          .collection(`${boxNumber}`)
          .get()
          .then(querySnapshot => {
            const cards = [];
            querySnapshot.forEach(doc => {
              const { addedAt, ...card } = doc.data();
              cards.push({ boxNumber, card });
            });
            return cards;
          }),
      );
      return Promise.all(boxes).then(boxes => {
        const reducedBoxes = boxes.reduce((allCards, cards) => [...allCards, ...cards], []);
        return reducedBoxes;
      });
    },
    getBoxes() {
      const boxes = [1, 2, 3].map(boxNumber =>
        db
          .collection('card-boxes')
          .doc(cardBoxId)
          .collection(`${boxNumber}`)
          .orderBy('addedAt', 'asc')
          .get()
          .then(querySnapshot => {
            const cards = [];
            querySnapshot.forEach(doc => {
              const { addedAt, ...card } = doc.data();
              cards.push(card);
            });
            return cards;
          }),
      );
      return Promise.all(boxes);
    },
    removeCardFromBox({ boxNumber, card }) {
      return db
        .collection('card-boxes')
        .doc(cardBoxId)
        .collection(`${boxNumber}`)
        .doc(card.id)
        .delete();
    },
    addCardInBox({ boxNumber, card }) {
      return db
        .collection('card-boxes')
        .doc(cardBoxId)
        .collection(`${boxNumber}`)
        .doc(card.id)
        .set({
          ...card,
          addedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
    },
    async getPreviousSessionNumber() {
      return db
        .collection('card-boxes')
        .doc(cardBoxId)
        .get()
        .then(doc => doc.data().previousSessionNumber);
    },
    async setPreviousSessionNumber(previousSessionNumber = 0) {
      return db
        .collection('card-boxes')
        .doc(cardBoxId)
        .set({ previousSessionNumber }, { merge: true });
    },
  };
};

module.exports = {
  FirebaseBoxesDb,
  db,
};
