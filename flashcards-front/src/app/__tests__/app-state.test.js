import {
  appStateReducer,
  isSessionScreen,
  sessionStarted,
  sessionEnded,
  defaultState
} from "../app-state";

describe("app state", () => {
  it("correct default app state", () => {
    const appState = appStateReducer();
    expect(isSessionScreen(appState)).toBe(false);
  });
  it("current screen is session when a session has started", () => {
    const appState = appStateReducer(undefined, sessionStarted());
    expect(isSessionScreen(appState)).toBe(true);
  });
  it("current screen is not session screen anymore when session has ended", () => {
    const appState = appStateReducer(
      {
        ...defaultState,
        currentScreen: "session"
      },
      sessionEnded()
    );
    expect(isSessionScreen(appState)).toBe(false);
  });
});
