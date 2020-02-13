const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");
const {
  createFirebaseExpressAuthMiddleware
} = require("./infrastructure/firebase-express-auth-middleware");
const PartitionsStore = require("./infrastructure/partitions-store");
const { createApp } = require("./app");

admin.initializeApp();

const partitionsData = [
  [
    {
      id: "1",
      question: "What is the first planet of our solar system ?",
      answer: "Mercury"
    },
    {
      id: "2",
      question: "What is the second planet of our solar system ?",
      answer: "Venus"
    }
  ],
  [
    {
      id: "3",
      question: "What is the third planet of our solar system ?",
      answer: "Earth"
    }
  ],
  [
    {
      id: "4",
      question: "What is the fourth planet of our solar system ?",
      answer: "Mars"
    },
    {
      id: "5",
      question: "What is the fith planet of our solar system ?",
      answer: "Jupiter"
    }
  ],
  [
    {
      id: "6",
      question: "What is the sixth planet of our solar system ?",
      answer: "Saturn"
    }
  ],
  [
    {
      id: "7",
      question: "What is the seventh planet of our solar system ?",
      answer: "Uranus"
    },
    {
      id: "8",
      question: "What is the eighth planet of our solar system ?",
      answer: "Neptune",
      partition: 5
    }
  ]
];

const app = createApp({
  partitionsStore: PartitionsStore.create({
    firestore: admin.firestore(),
    partitionsData: {
      testId: partitionsData
    }
  })
});

const firebaseExpressAuthMiddleware = createFirebaseExpressAuthMiddleware(
  admin.auth()
);

app.use(cors());
//app.use(firebaseExpressAuthMiddleware);

exports.api = functions.https.onRequest(app);
