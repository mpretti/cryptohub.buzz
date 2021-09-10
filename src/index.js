import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import GumballMachine from "./GumballMachine";
// import Sprites from "./sprites.js";
import reportWebVitals from "./reportWebVitals";
// import Sol from "./Sol";

ReactDOM.render(
  <React.StrictMode>
    <GumballMachine />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
