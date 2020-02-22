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
    shouldShowAnswer,
    areFlashcardsLoaded,
    areFlashcardsLoading,
    flashcardsRequestError,
    score,
    flashcardsRequestStarted,
    flashcardsRequestEnded,
    showAnswerRequested
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
  }, [
    areFlashcardsLoaded,
    flashcardsRequestStarted,
    idToken,
    flashcardsRequestEnded
  ]);

  return areFlashcardsLoading ? (
    <div>loading...</div>
  ) : (
    <div>
      {flashcardsRequestError && <strong>{flashcardsRequestError}</strong>}
      <h1>{shouldShowAnswer ? currentAnswer : currentQuestion}</h1>
      {shouldShowAnswer ? (
        <div>
          <button>i was right</button>
          <button>i was wrong</button>
        </div>
      ) : (
        <button onClick={showAnswerRequested}>show answer</button>
      )}
      <strong>score: {score}</strong>
    </div>
  );
};
