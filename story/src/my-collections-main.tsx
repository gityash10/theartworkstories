import React from "react";
import ReactDOM from "react-dom/client";

import MyCollections from "./pages/MyCollections";
import "./styles.css";

const root = document.getElementById("my-collections-root");

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <MyCollections />
    </React.StrictMode>,
  );
}
