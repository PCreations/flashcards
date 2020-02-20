import React from "react";
import { useAppState } from "./use-app-state";
import { Box } from "../Box";
import { Session } from "../session";

export const App = () => {
  const { isSessionScreen, sessionStarted } = useAppState();
  return (
    <div>
      {isSessionScreen ? (
        <Session />
      ) : (
        <>
          <Box />
          <button onClick={sessionStarted}>Start session</button>
        </>
      )}
    </div>
  );
};
