import React from "react";
import ReactDOM from "react-dom/client";

import Discover from "./pages/discover";
import "./styles.css";

const root = document.getElementById("discover-root");

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Discover />
    </React.StrictMode>,
  );
}