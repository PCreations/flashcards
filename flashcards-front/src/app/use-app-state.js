import { useReducer, useCallback } from "react";
import {
  appStateReducer,
  defaultState,
  isSessionScreen,
  sessionStarted,
  sessionEnded
} from "./app-state";

const actionDispatcher = (dispatch, action) => (...args) =>
  dispatch(action(...args));

export const useAppState = () => {
  const [appState, dispatch] = useReducer(appStateReducer, defaultState);

  return {
    isSessionScreen: isSessionScreen(appState),
    sessionStarted: useCallback(actionDispatcher(dispatch, sessionStarted), []),
    sessionEnded: useCallback(actionDispatcher(dispatch, sessionEnded), [])
  };
};
