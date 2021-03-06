import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/app";
import "firebase/auth";
import { AuthContext } from "./auth-context";

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

export class Authenticated extends React.Component {
  // The component's Local state.
  state = {
    isSignedIn: false, // Local signed-in state.
    idToken: ""
  };

  // Configure FirebaseUI.
  uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false
    }
  };

  // Listen to the Firebase Auth state and set the local state.
  componentDidMount() {
    this.unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged(async user => {
        const idToken = await user.getIdToken(true);
        this.setState(() => ({
          isSignedIn: !!user,
          idToken
        }));
      });
  }

  // Make sure we un-register Firebase observers when the component unmounts.
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  render() {
    if (!this.state.isSignedIn) {
      return (
        <StyledFirebaseAuth
          uiConfig={this.uiConfig}
          firebaseAuth={firebase.auth()}
        />
      );
    }
    return (
      <AuthContext.Provider value={this.state.idToken}>
        <div>{this.props.children}</div>
      </AuthContext.Provider>
    );
  }
}
