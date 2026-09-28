import React from "react";
import ReactDOM from "react-dom/client";

import Artists from "./pages/Artists";
import "./styles.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Artists />
  </React.StrictMode>,
);
