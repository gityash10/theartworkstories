import React from "react";
import ReactDOM from "react-dom/client";

import Explore from "./pages/explore";
import "./styles.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Explore />
  </React.StrictMode>,
);