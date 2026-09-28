import React from "react";
import ReactDOM from "react-dom/client";

import Account from "./settings/Account";
import Privacy from "./settings/Privacy";
import Notifications from "./settings/Notifications";
import Appearance from "./settings/Appearance";
import ConnectedAccounts from "./settings/ConnectedAccounts";
import DataStorage from "./settings/DataStorage";
import Security from "./settings/Security";
import HelpSupport from "./settings/HelpSupport";

import "./styles.css";

type SettingsPage =
  | "account"
  | "privacy"
  | "notifications"
  | "appearance"
  | "connected-accounts"
  | "data-storage"
  | "security"
  | "help-support";

function getSettingsPage(): SettingsPage {
  const pathname = window.location.pathname;

  /*
   * Expected URLs:
   *
   * /pages/app/settings/account/index.html
   * /pages/app/settings/privacy/index.html
   * /pages/app/settings/notifications/index.html
   * /pages/app/settings/appearance/index.html
   * /pages/app/settings/connected-accounts/index.html
   * /pages/app/settings/data-storage/index.html
   * /pages/app/settings/security/index.html
   * /pages/app/settings/help-support/index.html
   */

  const segments = pathname.split("/").filter(Boolean);

  const settingsIndex = segments.indexOf("settings");

  if (settingsIndex !== -1) {
    const section = segments[settingsIndex + 1];

    switch (section) {
      case "privacy":
        return "privacy";

      case "notifications":
        return "notifications";

      case "appearance":
        return "appearance";

      case "connected-accounts":
        return "connected-accounts";

      case "data-storage":
        return "data-storage";

      case "security":
        return "security";

      case "help-support":
        return "help-support";

      case "account":
      default:
        return "account";
    }
  }

  return "account";
}

function SettingsApp() {
  const page = getSettingsPage();

  switch (page) {
    case "privacy":
      return <Privacy />;

    case "notifications":
      return <Notifications />;

    case "appearance":
      return <Appearance />;

    case "connected-accounts":
      return <ConnectedAccounts />;

    case "data-storage":
      return <DataStorage />;

    case "security":
      return <Security />;

    case "help-support":
      return <HelpSupport />;

    case "account":
    default:
      return <Account />;
  }
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Settings root element not found.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <SettingsApp />
  </React.StrictMode>,
);
