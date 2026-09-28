import React from "react";
import ReactDOM from "react-dom/client";

import StoryOfTheWeek from "./pages/story-of-week";
import "./styles.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <StoryOfTheWeek />
  </React.StrictMode>,
);