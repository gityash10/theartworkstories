import {
    browserLocalPersistence,
    browserSessionPersistence,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    setPersistence,
    signInWithEmailAndPassword,
    signInWithPopup,
} from "firebase/auth";

import { auth } from "../../story/src/firebase.ts";

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const rememberMe = document.getElementById("rememberMe");

    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    const passwordToggle =
        document.getElementById("passwordToggle");

    const loginMessage =
        document.getElementById("loginMessage");

    const googleLogin =
        document.getElementById("googleLogin");

    const forgotPassword =
        document.getElementById("forgotPassword");

    if (
        !loginForm ||
        !emailInput ||
        !passwordInput ||
        !emailError ||
        !passwordError ||
        !loginMessage
    ) {
        return;
    }

    /* =========================================
       HELPERS
    ========================================= */

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showMessage(message, type = "") {
        loginMessage.textContent = message;

        loginMessage.className = "login-message";

        if (type) {
            loginMessage.classList.add(type);
        }
    }

    function setLoading(button, loading, loadingText, defaultText) {
        if (!button) {
            return;
        }

        button.disabled = loading;
        button.classList.toggle("is-loading", loading);

        const buttonText = button.querySelector("span");

        if (buttonText) {
            buttonText.textContent = loading
                ? loadingText
                : defaultText;
        }
    }

    function getFirebaseErrorMessage(error) {
        switch (error.code) {
            case "auth/invalid-credential":
                return "Invalid email or password.";

            case "auth/user-not-found":
                return "No account was found with this email address.";

            case "auth/wrong-password":
                return "Invalid email or password.";

            case "auth/too-many-requests":
                return "Too many attempts. Please try again later.";

            case "auth/user-disabled":
                return "This account has been disabled.";

            case "auth/network-request-failed":
                return "Network error. Please check your connection.";

            case "auth/popup-closed-by-user":
                return "Google sign-in was cancelled.";

            case "auth/popup-blocked":
                return "The Google sign-in popup was blocked by your browser.";

            case "auth/account-exists-with-different-credential":
                return "An account already exists with this email using a different sign-in method.";

            default:
                return "Something went wrong. Please try again.";
        }
    }

    /* =========================================
       PASSWORD VISIBILITY
    ========================================= */

    if (passwordToggle) {
        passwordToggle.addEventListener("click", () => {
            const isPassword =
                passwordInput.type === "password";

            passwordInput.type =
                isPassword ? "text" : "password";

            passwordToggle.textContent =
                isPassword ? "Hide" : "Show";

            passwordToggle.setAttribute(
                "aria-label",
                isPassword
                    ? "Hide password"
                    : "Show password"
            );
        });
    }

    /* =========================================
       EMAIL + PASSWORD LOGIN
    ========================================= */

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        emailError.textContent = "";
        passwordError.textContent = "";
        showMessage("");

        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const shouldRemember = rememberMe?.checked ?? false;

        let isValid = true;

        /* Email */

        if (!email) {
            emailError.textContent =
                "Please enter your email address.";

            isValid = false;
        } else if (!isValidEmail(email)) {
            emailError.textContent =
                "Please enter a valid email address.";

            isValid = false;
        }

        /* Password */

        if (!password) {
            passwordError.textContent =
                "Please enter your password.";

            isValid = false;
        } else if (password.length < 6) {
            passwordError.textContent =
                "Password must contain at least 6 characters.";

            isValid = false;
        }

        if (!isValid) {
            return;
        }

        const submitButton =
            loginForm.querySelector(".login-button");

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.classList.add("is-loading");

            const buttonText =
                submitButton.querySelector("span");

            if (buttonText) {
                buttonText.textContent = "Signing in...";
            }
        }

        try {
            const persistence = shouldRemember
                ? browserLocalPersistence
                : browserSessionPersistence;

            await setPersistence(auth, persistence);

            const userCredential =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            const user = userCredential.user;

            /*
             * Email/password users must verify their email
             * before entering the application.
             */
            if (!user.emailVerified) {
                showMessage(
                    "Please verify your email address before signing in."
                );

                return;
            }

            window.location.href =
                "/pages/app/discover/index.html";

        } catch (error) {
            console.error("Login error:", error);

            showMessage(
                getFirebaseErrorMessage(error),
                "error"
            );
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.classList.remove("is-loading");

                const buttonText =
                    submitButton.querySelector("span");

                if (buttonText) {
                    buttonText.textContent = "Sign In";
                }
            }
        }
    });

    /* =========================================
       GOOGLE LOGIN
    ========================================= */

    if (googleLogin) {
        googleLogin.addEventListener("click", async () => {
            showMessage("");

            googleLogin.disabled = true;
            googleLogin.classList.add("is-loading");

            try {
                const persistence =
                    rememberMe?.checked
                        ? browserLocalPersistence
                        : browserSessionPersistence;

                await setPersistence(auth, persistence);

                const provider =
                    new GoogleAuthProvider();

                await signInWithPopup(
                    auth,
                    provider
                );

                window.location.href =
                    "/pages/app/discover/index.html";

            } catch (error) {
                console.error(
                    "Google login error:",
                    error
                );

                showMessage(
                    getFirebaseErrorMessage(error),
                    "error"
                );

                googleLogin.disabled = false;
                googleLogin.classList.remove("is-loading");
            }
        });
    }

    /* =========================================
       FORGOT PASSWORD
    ========================================= */

    if (forgotPassword) {
        forgotPassword.addEventListener(
            "click",
            async (event) => {
                event.preventDefault();

                emailError.textContent = "";
                showMessage("");

                const email =
                    emailInput.value.trim();

                if (!email) {
                    emailError.textContent =
                        "Enter your email address first.";

                    emailInput.focus();

                    return;
                }

                if (!isValidEmail(email)) {
                    emailError.textContent =
                        "Please enter a valid email address.";

                    emailInput.focus();

                    return;
                }

                forgotPassword.style.pointerEvents =
                    "none";

                try {
                    await sendPasswordResetEmail(
                        auth,
                        email
                    );

                    showMessage(
                        "If an account exists for this email, a password reset link has been sent.",
                        "success"
                    );

                } catch (error) {
                    console.error(
                        "Password reset error:",
                        error
                    );

                    showMessage(
                        getFirebaseErrorMessage(error),
                        "error"
                    );
                } finally {
                    forgotPassword.style.pointerEvents =
                        "";
                }
            }
        );
    }
});