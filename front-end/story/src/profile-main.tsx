import React from "react";
import ReactDOM from "react-dom/client";
import ProfilePage from "./pages/Profile";
import "./styles.css";

const root = document.getElementById("profile-root");

if (!root) {
  throw new Error("Profile root element not found");
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ProfilePage />
  </React.StrictMode>,
);
