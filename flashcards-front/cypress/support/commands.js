const firebase = require("firebase/app");
require("firebase/auth");
require("@testing-library/cypress/add-commands");

const TEST_USER_EMAIL = "pcriulanf+cypress@gmail.com";
const TEST_USER_PASSWORD = "cypress";

// Configure Firebase.
const config = {
  apiKey: "AIzaSyDc91KhC87B_ktsR9RhlFAxz8ufKbTIaHE",
  authDomain: "flashcards-7c174.firebaseapp.com",
  databaseURL: "https://flashcards-7c174.firebaseio.com",
  projectId: "flashcards-7c174",
  storageBucket: "flashcards-7c174.appspot.com",
  messagingSenderId: "398781368445",
  appId: "1:398781368445:web:699c765fa0529b75"
};
firebase.initializeApp(config);

Cypress.Commands.add("login", () => {
  firebase
    .auth()
    .signInWithEmailAndPassword(TEST_USER_EMAIL, TEST_USER_PASSWORD);
});
