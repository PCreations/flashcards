import React, { useEffect, useContext } from "react";
import axios from "axios";
import { useSessionState } from "./use-session-state";
import { getConfig } from "../config";
import { AuthContext } from "../auth-context";

const apiRootUrl = getConfig().API_ROOT_URL;

export const Session = () => {
  const idToken = useContext(AuthContext);

  const {
    currentQuestion,
    currentAnswer,
    areFlashcardsLoaded,
    areFlashcardsLoading,
    flashcardsRequestError,
    score,
    flashcardsRequestStarted,
    flashcardsRequestEnded
  } = useSessionState();

  useEffect(() => {
    if (!areFlashcardsLoaded) {
      flashcardsRequestStarted();
      axios
        .get(`${apiRootUrl}/session-flashcards?boxId=test`, {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        })
        .then(res => res.data)
        .then(flashcards => flashcardsRequestEnded({ flashcards }))
        .catch(err => flashcardsRequestEnded({ error: err.message }));
    }
  });

  return areFlashcardsLoading ? (
    <div>loading...</div>
  ) : (
    <div>
      {flashcardsRequestError && <strong>{flashcardsRequestError}</strong>}
      <h1>{currentQuestion}</h1>
      <strong>score: {score}</strong>
    </div>
  );
};
