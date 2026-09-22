document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    const passwordToggle =
        document.getElementById("passwordToggle");

    const loginMessage =
        document.getElementById("loginMessage");

    const googleLogin =
        document.getElementById("googleLogin");

    /* =========================================
       PASSWORD VISIBILITY
    ========================================= */

    passwordToggle.addEventListener("click", () => {

        const isPassword =
            passwordInput.type === "password";

        passwordInput.type =
            isPassword ? "text" : "password";

        passwordToggle.textContent =
            isPassword ? "Hide" : "Show";

        passwordToggle.setAttribute(
            "aria-label",
            isPassword ? "Hide password" : "Show password"
        );

    });


    /* =========================================
       FORM VALIDATION
    ========================================= */

    loginForm.addEventListener("submit", (event) => {

        event.preventDefault();

        emailError.textContent = "";
        passwordError.textContent = "";
        loginMessage.textContent = "";

        const email = emailInput.value.trim();
        const password = passwordInput.value;

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


        /*
         * TEMPORARY DEMO LOGIN
         *
         * Real authentication will be connected later.
         */

        loginMessage.textContent =
            "Login interface is ready. Authentication will be connected soon.";

    });


    /* =========================================
       GOOGLE LOGIN
    ========================================= */

    googleLogin.addEventListener("click", () => {

        loginMessage.textContent =
            "Google authentication will be connected soon.";

    });


    /* =========================================
       FORGOT PASSWORD
    ========================================= */

    const forgotPassword =
        document.getElementById("forgotPassword");

    forgotPassword.addEventListener("click", (event) => {

        event.preventDefault();

        loginMessage.textContent =
            "Password recovery will be available soon.";

    });


    /* =========================================
       EMAIL VALIDATION
    ========================================= */

    function isValidEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    }

});