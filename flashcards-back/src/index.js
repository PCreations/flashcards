const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

admin.initializeApp();

const app = express();

app.use(cors());

app.get("/", async (req, res) => {
  const idToken = req.headers["authorization"];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log("decodedToken.uid", decodedToken.uid);
    res.send(`Hello World from Firebase!`);
  } catch (e) {
    return res.sendStatus(403);
  }
});

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest(app);
