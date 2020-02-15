const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");
const {
  createFirebaseExpressAuthMiddleware
} = require("./infrastructure/firebase-express-auth-middleware");
const BoxStore = require("./infrastructure/box-store");
const { createApp } = require("./app");

admin.initializeApp();

const app = createApp({
  partitionsStore: BoxStore.create({
    firestore: admin.firestore()
  })
});

const firebaseExpressAuthMiddleware = createFirebaseExpressAuthMiddleware(
  admin.auth()
);

app.use(cors());
//app.use(firebaseExpressAuthMiddleware);

exports.api = functions.https.onRequest(app);
