import React from "react";
import { useAppState } from "./use-app-state";
import { Box } from "../Box";
import { Session } from "../session";

export const App = () => {
  const { isSessionScreen, sessionStarted, sessionEnded } = useAppState();
  return (
    <div>
      {isSessionScreen ? (
        <Session notifySessionEnded={sessionEnded} />
      ) : (
        <>
          <Box />
          <button onClick={sessionStarted}>Start session</button>
        </>
      )}
    </div>
  );
};
