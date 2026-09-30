import React from "react";
import ReactDOM from "react-dom/client";

import ArtworkDetail from "./pages/ArtworkDetail";

import "./styles.css";

ReactDOM.createRoot(document.getElementById("artwork-root")!).render(
  <React.StrictMode>
    <ArtworkDetail />
  </React.StrictMode>,
);
