import React, { useEffect, useState } from "react";
import { getConfig } from "./config";
import firebase from "firebase/app";
import "firebase/auth";

const config = getConfig();

function App() {
  const [greetings, setGreetings] = useState(null);
  useEffect(() => {
    firebase
      .auth()
      .currentUser.getIdToken(/* forceRefresh */ true)
      .then(idToken => {
        fetch(config.API_URL, {
          headers: {
            Authorization: idToken
          }
        })
          .then(res => res.text())
          .then(setGreetings);
      });
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <p>{greetings}</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
