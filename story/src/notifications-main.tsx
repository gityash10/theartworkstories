import React from "react";
import { createRoot } from "react-dom/client";
import Notifications from "./pages/notifications";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <React.StrictMode>
    <Notifications />
  </React.StrictMode>
);