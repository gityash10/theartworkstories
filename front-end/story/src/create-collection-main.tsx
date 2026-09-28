import React from "react";
import ReactDOM from "react-dom/client";

import CreateCollection from "./pages/CreateCollection";
import "./styles.css";

const root = document.getElementById("create-collection-root");

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <CreateCollection />
    </React.StrictMode>,
  );
}
