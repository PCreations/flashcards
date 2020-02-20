import React from "react";
import ReactDOM from "react-dom";
import { Authenticated } from "./Authenticated";
import { App } from "./app";

ReactDOM.render(
  <Authenticated>
    <App />
  </Authenticated>,
  document.getElementById("root")
);
