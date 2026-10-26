document.addEventListener("DOMContentLoaded", function () {
    // =====================================
    // TASK 1: FORM VALIDATION
    // =====================================
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
            if (!name || !email || !password || !confirmPassword ||
                !nameError || !emailError || !passwordError ||
                !confirmError || !message) {
                return;
            }
            nameError.textContent = "";
            emailError.textContent = "";
            passwordError.textContent = "";
            confirmError.textContent = "";
            message.textContent = "";
            [name, email, password, confirmPassword].forEach(function (input) {
                input.classList.remove("invalid");
            });
            let valid = true;
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (name.value.trim().length < 2) {
                nameError.textContent = "Please enter your name.";
                name.classList.add("invalid");
                valid = false;
            }
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
                message.textContent = "Success! Your form has been validated.";
                message.className = "form-message success";
                form.reset();
            } else {
                message.textContent = "Please correct the errors above.";
                message.className = "form-message error";
            }
        });
    }
    // =====================================
    // TASK 2: FAQ ACCORDION
    // =====================================
    const faq = document.getElementById("solace-faq");
    if (faq) {
        const questions = faq.querySelectorAll(".solace-faq__question");
        questions.forEach(function (button) {
            const answerId = button.getAttribute("aria-controls");
            const answer = document.getElementById(answerId);
            if (!answer) return;
            answer.style.overflow = "hidden";
            answer.style.maxHeight = "0";
            answer.style.paddingTop = "0";
            answer.style.paddingBottom = "0";
            answer.style.transition =
                "max-height 0.3s ease, padding 0.3s ease";
            answer.hidden = false;
            button.setAttribute("aria-expanded", "false");
            button.addEventListener("click", function () {
                const isOpen =
                    button.getAttribute("aria-expanded") === "true";
                if (isOpen) {
                    answer.style.maxHeight = "0";
                    answer.style.paddingTop = "0";
                    answer.style.paddingBottom = "0";
                    button.setAttribute("aria-expanded", "false");
                } else {
                    answer.style.paddingTop = "18px";
                    answer.style.paddingBottom = "18px";
                    answer.style.maxHeight = answer.scrollHeight + 50 + "px";
                    button.setAttribute("aria-expanded", "true");
                }
            });
        });
    }
    // =====================================
    // TASK 3: SUBSCRIPTION POPUP
    // =====================================
    const popup = document.getElementById("popupOverlay");
    const openPopupButton = document.getElementById("openPopup");
    const closePopupButton = document.getElementById("closePopup");
    const subscriptionForm = document.getElementById("subscriptionForm");
    function closePopup() {
        if (popup) {
            popup.classList.remove("active");
            document.body.classList.remove("popup-open");
        }
    }
    if (popup && openPopupButton) {
        openPopupButton.addEventListener("click", function () {
            popup.classList.add("active");
            document.body.classList.add("popup-open");
        });
    }
    if (closePopupButton) {
        closePopupButton.addEventListener("click", closePopup);
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
            if (!subscriberName || !subscriberEmail || !subscriptionMessage) {
                return;
            }
            if (subscriberName.value.trim() === "") {
                subscriptionMessage.textContent = "Please enter your name.";
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
    // =====================================
    // TASK 4: BACKGROUND COLOR CHANGER
    // =====================================
    const moodButtons = document.querySelectorAll(".mood-button");
    moodButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const color = button.dataset.color;
            if (!color) {
                return;
            }
            document.documentElement.style.setProperty("--cream-light", color);
            document.documentElement.style.setProperty("--cream", color);
            document.body.style.backgroundColor = color;
            moodButtons.forEach(function (item) {
                item.setAttribute("aria-pressed", "false");
            });
            button.setAttribute("aria-pressed", "true");
        });
    });
    // =====================================
    // TASK 5: CURRENT DATE AND TIME
    // =====================================
    const dateElement = document.getElementById("currentDate");
    const timeElement = document.getElementById("currentTime");
    function updateDateTime() {
        const now = new Date();
        if (dateElement) {
            dateElement.textContent = now.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            });
        }
        if (timeElement) {
            timeElement.textContent = now.toLocaleTimeString("en-GB", {
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
