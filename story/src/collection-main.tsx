import React from "react";
import ReactDOM from "react-dom/client";

import Collection from "./pages/Collection";
import "./styles.css";

const root = document.getElementById(
  "collection-root",
);

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Collection />
    </React.StrictMode>,
  );
}