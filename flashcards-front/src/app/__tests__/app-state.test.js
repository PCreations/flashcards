import {
  appStateReducer,
  getCurrentScreen,
  sessionStarted
} from "../app-state";

describe("app state", () => {
  it("correct default app state", () => {
    const appState = appStateReducer();
    expect(getCurrentScreen(appState)).toBe("list");
  });
  it("current screen is session when a session has started", () => {
    const appState = appStateReducer(undefined, sessionStarted());
    expect(getCurrentScreen(appState)).toBe("session");
  });
});
