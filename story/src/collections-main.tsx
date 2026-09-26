import React from "react";
import ReactDOM from "react-dom/client";

import Collections from "./pages/collections";
import "./styles.css";

const root = document.getElementById(
  "collections-root",
);

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Collections />
    </React.StrictMode>,
  );
}
