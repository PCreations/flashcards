const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");
const express = require("express");
const { createBox } = require("./domain/box");

const {
  createFirebaseExpressAuthMiddleware
} = require("./infrastructure/firebase-express-auth-middleware");
const BoxStore = require("./infrastructure/box-store");
const { createApp } = require("./app");

admin.initializeApp();

const firebaseExpressAuthMiddleware = createFirebaseExpressAuthMiddleware(
  admin.auth()
);

const boxStore = BoxStore.create({
  firestore: admin.firestore()
});

const app = createApp({
  boxStore,
  middlewares: [cors({ origin: true }), firebaseExpressAuthMiddleware]
});

const test = express();

test.use(express.json());
test.use(cors({ origin: true }));
test.post("/__seedDb", async (req, res) => {
  const { partitions, sessionDay } = req.body;
  console.log(partitions);
  try {
    await boxStore.save(createBox({ id: "test", partitions, sessionDay }));
    const box = await boxStore.get("test");
    res.json({
      partitions: box.partitions,
      archivedFlashcards: box.archivedFlashcards
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

exports.api = functions.https.onRequest(app);
exports.test = functions.https.onRequest(test);
