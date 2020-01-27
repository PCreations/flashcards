import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Authenticated } from "./Authenticated";

ReactDOM.render(
  <Authenticated>
    <App />
  </Authenticated>,
  document.getElementById("root")
);
