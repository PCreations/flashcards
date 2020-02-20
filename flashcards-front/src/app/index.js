import React from "react";
import { useAppState } from "./use-app-state";
import { Box } from "../Box";

export const App = () => {
  const { currentScreen, sessionStarted } = useAppState();
  return (
    <div>
      {currentScreen === "list" ? (
        <>
          <Box />
          <button onClick={sessionStarted}>Start session</button>
        </>
      ) : (
        <strong>score: 0</strong>
      )}
    </div>
  );
};
