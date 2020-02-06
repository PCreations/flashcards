import React from "react";
import ReactDOM from "react-dom";
import { Box } from "./Box";
import { Authenticated } from "./Authenticated";

ReactDOM.render(
  <Authenticated>
    <Box />
  </Authenticated>,
  document.getElementById("root")
);
