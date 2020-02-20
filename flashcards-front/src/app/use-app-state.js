import { useReducer, useCallback } from "react";
import {
  appStateReducer,
  defaultState,
  getCurrentScreen,
  sessionStarted
} from "./app-state";

const actionDispatcher = (dispatch, action) => (...args) =>
  dispatch(action(...args));

export const useAppState = () => {
  const [appState, dispatch] = useReducer(appStateReducer, defaultState);

  return {
    currentScreen: getCurrentScreen(appState),
    sessionStarted: useCallback(actionDispatcher(dispatch, sessionStarted), [])
  };
};
