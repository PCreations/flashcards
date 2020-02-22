import { useReducer, useCallback } from "react";
import {
  defaultState,
  sessionStateReducer,
  getCurrentQuestion,
  getCurrentAnswer,
  getCurrentFlashcardId,
  areFlashcardsLoading,
  getFlashcardsRequestError,
  getScore,
  shouldShowAnswer,
  isSessionOver,
  areFlashcardsLoaded,
  flashcardsRequestStarted,
  flashcardsRequestEnded,
  showAnswerRequested,
  submitAnswerRequestStarted,
  submitAnswerRequestEnded,
  isSubmitAnswerRequestLoading
} from "./session-state";

const actionDispatcher = (dispatch, action) => (...args) =>
  dispatch(action(...args));

export const useSessionState = () => {
  const [sessionState, dispatch] = useReducer(
    sessionStateReducer,
    defaultState
  );

  return {
    currentQuestion: getCurrentQuestion(sessionState),
    currentAnswer: getCurrentAnswer(sessionState),
    currentFlashcardId: getCurrentFlashcardId(sessionState),
    areFlashcardsLoading: areFlashcardsLoading(sessionState),
    areFlashcardsLoaded: areFlashcardsLoaded(sessionState),
    flashcardsRequestError: getFlashcardsRequestError(sessionState),
    shouldShowAnswer: shouldShowAnswer(sessionState),
    isSessionOver: isSessionOver(sessionState),
    score: getScore(sessionState),
    isSubmitAnswerRequestLoading: isSubmitAnswerRequestLoading(sessionState),
    flashcardsRequestStarted: useCallback(
      actionDispatcher(dispatch, flashcardsRequestStarted),
      []
    ),
    flashcardsRequestEnded: useCallback(
      actionDispatcher(dispatch, flashcardsRequestEnded),
      []
    ),
    submitAnswerRequestStarted: useCallback(
      actionDispatcher(dispatch, submitAnswerRequestStarted)
    ),
    submitAnswerRequestEnded: useCallback(
      actionDispatcher(dispatch, submitAnswerRequestEnded)
    ),
    showAnswerRequested: useCallback(
      actionDispatcher(dispatch, showAnswerRequested),
      []
    )
  };
};
