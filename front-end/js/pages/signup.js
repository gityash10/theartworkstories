import {
    browserLocalPersistence,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    sendEmailVerification,
    setPersistence,
    signInWithPopup,
    updateProfile,
} from "firebase/auth";

import { auth } from "../../story/src/firebase.ts";

document.addEventListener("DOMContentLoaded", () => {
    const signupForm =
        document.getElementById("signupForm");

    const nameInput =
        document.getElementById("name");

    const emailInput =
        document.getElementById("email");

    const passwordInput =
        document.getElementById("password");

    const passwordToggle =
        document.getElementById("passwordToggle");

    const termsCheckbox =
        document.getElementById("terms");

    const signupSubmit =
        document.getElementById("signupSubmit");

    const signupMessage =
        document.getElementById("signupMessage");

    const googleSignup =
        document.getElementById("googleSignup");

    if (!signupForm) {
        return;
    }

    /* =====================================================
       HELPERS
    ===================================================== */

    function setError(fieldId, message) {
        const errorElement =
            document.getElementById(
                `${fieldId}Error`
            );

        const fieldElement =
            document
                .getElementById(fieldId)
                ?.closest(".signup-field");

        if (errorElement) {
            errorElement.textContent = message;
        }

        if (fieldElement) {
            fieldElement.classList.toggle(
                "has-error",
                Boolean(message)
            );
        }
    }

    function clearErrors() {
        setError("name", "");
        setError("email", "");
        setError("password", "");

        const termsError =
            document.getElementById("termsError");

        if (termsError) {
            termsError.textContent = "";
        }

        const termsContainer =
            document.querySelector(".signup-terms");

        if (termsContainer) {
            termsContainer.classList.remove(
                "has-error"
            );
        }
    }

    function showMessage(message, type = "") {
        if (!signupMessage) {
            return;
        }

        signupMessage.textContent = message;

        signupMessage.className =
            "signup-form-message";

        if (type) {
            signupMessage.classList.add(type);
        }
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            email
        );
    }

    function getFirebaseErrorMessage(error) {
        switch (error.code) {
            case "auth/email-already-in-use":
                return "An account already exists with this email address.";

            case "auth/invalid-email":
                return "Please enter a valid email address.";

            case "auth/weak-password":
                return "Please choose a stronger password.";

            case "auth/too-many-requests":
                return "Too many attempts. Please try again later.";

            case "auth/network-request-failed":
                return "Network error. Please check your connection.";

            case "auth/popup-closed-by-user":
                return "Google sign-up was cancelled.";

            case "auth/popup-blocked":
                return "The Google sign-in popup was blocked by your browser.";

            case "auth/account-exists-with-different-credential":
                return "An account already exists with this email using a different sign-in method.";

            default:
                return "Something went wrong. Please try again.";
        }
    }

    /* =====================================================
       PASSWORD VISIBILITY
    ===================================================== */

    if (passwordToggle && passwordInput) {
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

    /* =====================================================
       REAL-TIME ERROR CLEANUP
    ===================================================== */

    ["name", "email", "password"].forEach(
        (fieldId) => {
            const field =
                document.getElementById(fieldId);

            if (!field) {
                return;
            }

            field.addEventListener(
                "input",
                () => {
                    setError(fieldId, "");
                    showMessage("");
                }
            );
        }
    );

    if (termsCheckbox) {
        termsCheckbox.addEventListener(
            "change",
            () => {
                const termsError =
                    document.getElementById(
                        "termsError"
                    );

                if (termsError) {
                    termsError.textContent = "";
                }
            }
        );
    }

    /* =====================================================
       EMAIL + PASSWORD SIGNUP
    ===================================================== */

    signupForm.addEventListener(
        "submit",
        async (event) => {
            event.preventDefault();

            clearErrors();
            showMessage("");

            const name =
                nameInput?.value.trim() || "";

            const email =
                emailInput?.value.trim() || "";

            const password =
                passwordInput?.value || "";

            const termsAccepted =
                termsCheckbox?.checked || false;

            let isValid = true;

            /* Name */

            if (!name) {
                setError(
                    "name",
                    "Please enter your name."
                );

                isValid = false;
            }

            /* Email */

            if (!email) {
                setError(
                    "email",
                    "Please enter your email address."
                );

                isValid = false;
            } else if (!isValidEmail(email)) {
                setError(
                    "email",
                    "Please enter a valid email address."
                );

                isValid = false;
            }

            /* Password */

            if (!password) {
                setError(
                    "password",
                    "Please create a password."
                );

                isValid = false;
            } else if (password.length < 6) {
                setError(
                    "password",
                    "Password must contain at least 6 characters."
                );

                isValid = false;
            }

            /* Terms */

            if (!termsAccepted) {
                const termsError =
                    document.getElementById(
                        "termsError"
                    );

                if (termsError) {
                    termsError.textContent =
                        "Please accept the Terms and Privacy Policy.";
                }

                isValid = false;
            }

            if (!isValid) {
                return;
            }

            if (signupSubmit) {
                signupSubmit.disabled = true;
                signupSubmit.classList.add(
                    "is-loading"
                );

                const buttonText =
                    signupSubmit.querySelector("span");

                if (buttonText) {
                    buttonText.textContent =
                        "Creating account...";
                }
            }

            try {
                /*
                 * Create Firebase account.
                 */
                const userCredential =
                    await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );

                const user =
                    userCredential.user;

                /*
                 * Save the user's name in the
                 * Firebase Auth profile.
                 *
                 * Firestore profile data will be
                 * added in the next Firebase phase.
                 */
                await updateProfile(user, {
                    displayName: name,
                });

                /*
                 * Send email verification.
                 */
                await sendEmailVerification(user);

                /*
                 * Do not leave the user signed in
                 * before email verification.
                 */
                await auth.signOut();

                showMessage(
                    "Account created. Check your email to verify your account, then sign in.",
                    "success"
                );

                signupForm.reset();

            } catch (error) {
                console.error(
                    "Signup error:",
                    error
                );

                showMessage(
                    getFirebaseErrorMessage(error),
                    "error"
                );

            } finally {
                if (signupSubmit) {
                    signupSubmit.disabled = false;
                    signupSubmit.classList.remove(
                        "is-loading"
                    );

                    const buttonText =
                        signupSubmit.querySelector(
                            "span"
                        );

                    if (buttonText) {
                        buttonText.textContent =
                            "Create Account";
                    }
                }
            }
        }
    );

    /* =====================================================
       GOOGLE SIGNUP
    ===================================================== */

    if (googleSignup) {
        googleSignup.addEventListener(
            "click",
            async () => {
                showMessage("");

                googleSignup.disabled = true;
                googleSignup.classList.add(
                    "is-loading"
                );

                try {
                    await setPersistence(
                        auth,
                        browserLocalPersistence
                    );

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
                        "Google signup error:",
                        error
                    );

                    showMessage(
                        getFirebaseErrorMessage(error),
                        "error"
                    );

                    googleSignup.disabled = false;
                    googleSignup.classList.remove(
                        "is-loading"
                    );
                }
            }
        );
    }
});