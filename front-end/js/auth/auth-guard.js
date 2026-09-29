/*
 * Shared Firebase Authentication guard for every protected page
 * under /pages/app/*.
 *
 * - The script tag is placed in <head> of every protected page, so this
 *   module runs before any page-specific script.
 * - The document is hidden synchronously before Firebase is loaded so an
 *   unauthenticated visitor never sees protected content flash.
 * - Firebase Auth is the single source of truth. Nothing is read from or
 *   written to localStorage for authentication.
 * - Fails closed: if the Firebase check fails for any reason, the user is
 *   redirected to the login page.
 */

const LOGIN_URL = "/pages/login/index.html";

/* Hide immediately and synchronously — runs before any import resolves. */
document.documentElement.style.visibility = "hidden";

function redirectToLogin() {
  /* replace() so the protected URL does not stay in browser history. */
  window.location.replace(LOGIN_URL);
}

function revealPage() {
  document.documentElement.style.visibility = "";
}

async function runGuard() {
  try {
    /*
     * Reuse the project's single existing Firebase initialization
     * (front-end/story/src/firebase.ts) — no second config anywhere.
     */
    const { auth } = await import("../../story/src/firebase.ts");
    const { onAuthStateChanged } = await import("firebase/auth");

    /*
     * Wait until Firebase has fully resolved the initial auth state
     * (including restoring a persisted session). onAuthStateChanged
     * otherwise fires with `null` first and would wrongly redirect a
     * logged-in user mid-restore (e.g. on refresh).
     */
    await auth.authStateReady();

    /* Live auth-state changes from now on: sign-out redirects to login. */
    onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          revealPage();
        } else {
          redirectToLogin();
        }
      },
      () => {
        /* Auth state could not be determined — fail closed. */
        redirectToLogin();
      },
    );

    /* Decisive initial check — authStateReady() has resolved above. */
    if (auth.currentUser) {
      revealPage();
    } else {
      redirectToLogin();
    }
  } catch {
    /* Firebase failed to initialize or load — fail closed. */
    redirectToLogin();
  }
}

runGuard();
