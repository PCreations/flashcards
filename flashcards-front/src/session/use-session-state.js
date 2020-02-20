import { useReducer, useCallback } from "react";
import {
  defaultState,
  sessionStateReducer,
  getCurrentQuestion,
  getCurrentAnswer,
  areFlashcardsLoading,
  getFlashcardsRequestError,
  getScore,
  areFlashcardsLoaded,
  flashcardsRequestStarted,
  flashcardsRequestEnded
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
    areFlashcardsLoading: areFlashcardsLoading(sessionState),
    areFlashcardsLoaded: areFlashcardsLoaded(sessionState),
    flashcardsRequestError: getFlashcardsRequestError(sessionState),
    score: getScore(sessionState),
    flashcardsRequestStarted: useCallback(
      actionDispatcher(dispatch, flashcardsRequestStarted),
      []
    ),
    flashcardsRequestEnded: useCallback(
      actionDispatcher(dispatch, flashcardsRequestEnded),
      []
    )
  };
};
