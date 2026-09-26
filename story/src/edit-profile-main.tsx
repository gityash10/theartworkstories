import React from "react";
import ReactDOM from "react-dom/client";
import EditProfilePage from "./pages/EditProfile";
import "./styles.css";

const root = document.getElementById("edit-profile-root");

if (!root) {
  throw new Error("Edit Profile root element not found");
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <EditProfilePage />
  </React.StrictMode>
);