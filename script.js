
// ==========================================
// TASK 1: FORM VALIDATION
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("signupForm");

    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("fullName");
            const email = document.getElementById("email");
            const password = document.getElementById("password");
            const confirmPassword = document.getElementById("confirmPassword");

            const nameError = document.getElementById("nameError");
            const emailError = document.getElementById("emailError");
            const passwordError = document.getElementById("passwordError");
            const confirmError = document.getElementById("confirmPasswordError");
            const message = document.getElementById("formMessage");

            nameError.textContent = "";
            emailError.textContent = "";
            passwordError.textContent = "";
            confirmError.textContent = "";
            message.textContent = "";

            [name, email, password, confirmPassword].forEach(function (input) {
                input.classList.remove("invalid");
            });

            let valid = true;

            if (name.value.trim().length < 2) {
                nameError.textContent = "Please enter your name.";
                name.classList.add("invalid");
                valid = false;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email.value.trim())) {
                emailError.textContent = "Please enter a valid email.";
                email.classList.add("invalid");
                valid = false;
            }

            if (password.value.length < 8) {
                passwordError.textContent =
                    "Password must contain at least 8 characters.";
                password.classList.add("invalid");
                valid = false;
            }

            if (confirmPassword.value === "") {
                confirmError.textContent = "Please confirm your password.";
                confirmPassword.classList.add("invalid");
                valid = false;
            } else if (password.value !== confirmPassword.value) {
                confirmError.textContent = "Passwords do not match.";
                confirmPassword.classList.add("invalid");
                valid = false;
            }

            if (valid) {
                message.textContent =
                    "Success! Your form has been validated.";
                message.className = "form-message success";
                form.reset();
            } else {
                message.textContent =
                    "Please correct the errors above.";
                message.className = "form-message error";
            }
        });
    }


    // ==========================================
    // TASK 3: POPUP SUBSCRIPTION FORM
    // ==========================================

    const popup = document.getElementById("popupOverlay");
    const openButton = document.getElementById("openPopup");
    const closeButton = document.getElementById("closePopup");
    const subscriptionForm =
        document.getElementById("subscriptionForm");

    function closePopup() {
        if (popup) {
            popup.classList.remove("active");
            document.body.classList.remove("popup-open");
        }
    }

    if (popup && openButton) {
        openButton.addEventListener("click", function () {
            popup.classList.add("active");
            document.body.classList.add("popup-open");
        });
    }

    if (closeButton) {
        closeButton.addEventListener("click", closePopup);
    }

    if (popup) {
        popup.addEventListener("click", function (event) {
            if (event.target === popup) {
                closePopup();
            }
        });
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closePopup();
        }
    });

    if (subscriptionForm) {
        subscriptionForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const subscriberName =
                document.getElementById("subscriberName");
            const subscriberEmail =
                document.getElementById("subscriberEmail");
            const subscriptionMessage =
                document.getElementById("subscriptionMessage");

            if (!subscriberName.value.trim()) {
                subscriptionMessage.textContent =
                    "Please enter your name.";
                return;
            }

            if (!subscriberEmail.checkValidity()) {
                subscriptionMessage.textContent =
                    "Please enter a valid email address.";
                return;
            }

            subscriptionMessage.textContent =
                "Thank you for subscribing to our Coffee Club!";

            subscriptionForm.reset();
        });
    }


    // ==========================================
    // TASK 5: CURRENT DATE AND TIME
    // ==========================================

    const currentDate = document.getElementById("currentDate");
    const currentTime = document.getElementById("currentTime");

    function updateDateTime() {
        const now = new Date();

        if (currentDate) {
            currentDate.textContent = now.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            });
        }

        if (currentTime) {
            currentTime.textContent = now.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false
            });
        }
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);

});

// ==========================================
// TASK 4: CHANGE BACKGROUND COLOR
// Used on menu.html
// ==========================================
const moodButtons = document.querySelectorAll(".mood-button");
moodButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const selectedColor = button.dataset.color;
        if (!selectedColor) {
            return;
        }
        document.documentElement.style.setProperty(
            "--cream-light",
            selectedColor
        );
        document.documentElement.style.setProperty(
            "--cream",
            selectedColor
        );
        moodButtons.forEach(function (item) {
            item.setAttribute("aria-pressed", "false");
        });
        button.setAttribute("aria-pressed", "true");
    });
});
