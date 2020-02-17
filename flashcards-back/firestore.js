const admin = require("firebase-admin");
const serviceAccount = require("./secret/flashcards-7c174-firebase-adminsdk-fztge-942eb9ac19.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = {
  db
};
