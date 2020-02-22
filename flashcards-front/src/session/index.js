import React, { useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { useSessionState } from "./use-session-state";
import { getConfig } from "../config";
import { AuthContext } from "../auth-context";

const apiRootUrl = getConfig().API_ROOT_URL;

export const Session = ({ notifySessionEnded }) => {
  const idToken = useContext(AuthContext);

  const {
    currentQuestion,
    currentAnswer,
    currentFlashcardId,
    shouldShowAnswer,
    isSessionOver,
    areFlashcardsLoaded,
    areFlashcardsLoading,
    flashcardsRequestError,
    score,
    isSubmitAnswerRequestLoading,
    flashcardsRequestStarted,
    flashcardsRequestEnded,
    submitAnswerRequestStarted,
    submitAnswerRequestEnded,
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
        .then(flashcards => flashcardsRequestEnded({ data: flashcards }))
        .catch(err => flashcardsRequestEnded({ error: err.message }));
    }
  }, [
    areFlashcardsLoaded,
    flashcardsRequestStarted,
    idToken,
    flashcardsRequestEnded
  ]);

  const submitAnswer = useCallback(
    right => {
      if (!isSubmitAnswerRequestLoading) {
        submitAnswerRequestStarted();
        axios
          .get(
            `${apiRootUrl}/submit-answer?boxId=test&flashcardId=${currentFlashcardId}&right=${Number(
              right
            )}`,
            {
              headers: {
                Authorization: `Bearer ${idToken}`
              }
            }
          )
          .then(res => res.data)
          .then(({ score }) => submitAnswerRequestEnded({ data: score }))
          .catch(err => submitAnswerRequestEnded({ error: err.message }));
      }
    },
    [
      isSubmitAnswerRequestLoading,
      submitAnswerRequestStarted,
      currentFlashcardId,
      idToken,
      submitAnswerRequestEnded
    ]
  );

  const submitRightAnswer = useCallback(() => submitAnswer(true), [
    submitAnswer
  ]);

  const submitWrongAnswer = useCallback(() => submitAnswer(false), [
    submitAnswer
  ]);

  return areFlashcardsLoading ? (
    <div>loading...</div>
  ) : (
    <div>
      {flashcardsRequestError && <strong>{flashcardsRequestError}</strong>}
      {isSessionOver ? (
        <>
          <h1>Session over</h1>
          <button onClick={notifySessionEnded}>back to flashcard list</button>
        </>
      ) : (
        <>
          <h1>{shouldShowAnswer ? currentAnswer : currentQuestion}</h1>
          {shouldShowAnswer ? (
            <div>
              <button onClick={submitRightAnswer}>i was right</button>
              <button onClick={submitWrongAnswer}>i was wrong</button>
            </div>
          ) : (
            <button onClick={showAnswerRequested}>show answer</button>
          )}
        </>
      )}
      <strong>score: {score}</strong>
    </div>
  );
};
