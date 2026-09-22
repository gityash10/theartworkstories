/**
 * The ArtWork Stories
 * Signup Page
 */

document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupForm");
    const passwordInput = document.getElementById("password");
    const passwordToggle = document.getElementById("passwordToggle");
    const signupSubmit = document.getElementById("signupSubmit");
    const signupMessage = document.getElementById("signupMessage");
    const googleSignup = document.getElementById("googleSignup");

    if (!signupForm) {
        return;
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
       HELPERS
       ===================================================== */

    function setError(fieldId, message) {
        const errorElement =
            document.getElementById(`${fieldId}Error`);

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
            termsContainer.classList.remove("has-error");
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
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }


    /* =====================================================
       REAL-TIME ERROR CLEANUP
       ===================================================== */

    const fields = [
        "name",
        "email",
        "password"
    ];

    fields.forEach((fieldId) => {
        const field =
            document.getElementById(fieldId);

        if (!field) {
            return;
        }

        field.addEventListener("input", () => {
            setError(fieldId, "");
            showMessage("");
        });
    });


    const termsCheckbox =
        document.getElementById("terms");

    if (termsCheckbox) {
        termsCheckbox.addEventListener("change", () => {
            const termsError =
                document.getElementById("termsError");

            if (termsError) {
                termsError.textContent = "";
            }
        });
    }


    /* =====================================================
       FORM SUBMISSION
       ===================================================== */

    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        clearErrors();
        showMessage("");

        const name =
            document
                .getElementById("name")
                ?.value
                .trim();

        const email =
            document
                .getElementById("email")
                ?.value
                .trim();

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
                document.getElementById("termsError");

            if (termsError) {
                termsError.textContent =
                    "Please accept the Terms and Privacy Policy.";
            }

            isValid = false;
        }


        if (!isValid) {
            return;
        }


        /* =================================================
           TEMPORARY CLIENT-SIDE SIGNUP
           Replace with Supabase/Auth API later.
        ================================================= */

        if (signupSubmit) {
            signupSubmit.disabled = true;
            signupSubmit.classList.add("is-loading");

            const buttonText =
                signupSubmit.querySelector("span");

            if (buttonText) {
                buttonText.textContent =
                    "Creating account...";
            }
        }


        /*
         * Temporary delay to simulate account creation.
         * Replace this block with the actual authentication
         * API when backend authentication is connected.
         */

        await new Promise((resolve) => {
            setTimeout(resolve, 800);
        });


        showMessage(
            "Account form is ready. Authentication will be connected soon.",
            "success"
        );


        if (signupSubmit) {
            signupSubmit.disabled = false;
            signupSubmit.classList.remove("is-loading");

            const buttonText =
                signupSubmit.querySelector("span");

            if (buttonText) {
                buttonText.textContent =
                    "Create Account";
            }
        }
    });


    /* =====================================================
       GOOGLE SIGNUP
       ===================================================== */

    if (googleSignup) {
        googleSignup.addEventListener("click", () => {
            showMessage(
                "Google sign-in will be connected soon.",
                "success"
            );
        });
    }
});