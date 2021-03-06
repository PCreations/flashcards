const SESSION_STARTED = "[app state] : a session has started";
const SESSION_ENDED = "[app state] : a session has ended";

const LIST_SCREEN = "list";
const SESSION_SCREEN = "session";

export const defaultState = {
  currentScreen: "list"
};

export const appStateReducer = (appState = defaultState, action) => {
  if (!action) return appState;
  if (
    appState.currentScreen === LIST_SCREEN &&
    action.type === SESSION_STARTED
  ) {
    return {
      currentScreen: SESSION_SCREEN
    };
  }
  if (
    appState.currentScreen === SESSION_SCREEN &&
    action.type === SESSION_ENDED
  ) {
    return {
      currentScreen: LIST_SCREEN
    };
  }
  return appState;
};

export const isSessionScreen = appState =>
  appState.currentScreen === SESSION_SCREEN;

export const sessionStarted = () => ({
  type: SESSION_STARTED
});

export const sessionEnded = () => ({
  type: SESSION_ENDED
});
