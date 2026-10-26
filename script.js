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
// ASSIGNMENT 5: SOUND EFFECT
// =====================================
function playSuccessSound() {
    const audioContext = new (
        window.AudioContext || window.webkitAudioContext
    )();

    const oscillator = audioContext.createOscillator();
    const volume = audioContext.createGain();

    oscillator.connect(volume);
    volume.connect(audioContext.destination);

    oscillator.frequency.value = 880;
    oscillator.type = "sine";

    volume.gain.setValueAtTime(0.3, audioContext.currentTime);
    volume.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.4
    );

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.4);

    oscillator.onended = function () {
        audioContext.close();
    };
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

playSuccessSound();

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
// =====================================
// ASSIGNMENT 5: INTERACTIVE RATING
// =====================================

const ratingStars = document.querySelectorAll(".rating-star");
const ratingMessage = document.getElementById("ratingMessage");

const ratingTexts = [
    "We are sorry to hear that.",
    "We will try to do better.",
    "Thank you for your feedback!",
    "We are glad you enjoyed your visit!",
    "Thank you for loving Solace!"
];

ratingStars.forEach(function (star) {
    star.addEventListener("click", function () {
        const rating = Number(star.dataset.rating);

        ratingStars.forEach(function (item) {
            const value = Number(item.dataset.rating);

            if (value <= rating) {
                item.classList.add("selected");
            } else {
                item.classList.remove("selected");
            }
        });

        if (ratingMessage) {
            ratingMessage.textContent = ratingTexts[rating - 1];
        }
    });
});
// =====================================
// ASSIGNMENT 5: DYNAMIC GREETING
// =====================================

const visitorName = document.getElementById("visitorName");
const greetingButton = document.getElementById("greetingButton");
const greetingMessage = document.getElementById("greetingMessage");

const greetings = {
    morning: "Good morning",
    afternoon: "Good afternoon",
    evening: "Good evening",
    night: "Good night",

    getGreeting: function (period, name) {
        return this[period] + ", " + name + "! Welcome to Solace.";
    }
};

if (visitorName && greetingButton && greetingMessage) {
    greetingButton.addEventListener("click", function () {
        const name = visitorName.value.trim();

        if (name === "") {
            greetingMessage.textContent = "Please enter your name.";
            return;
        }

        const hour = new Date().getHours();
        let period;

        switch (true) {
            case hour >= 5 && hour < 12:
                period = "morning";
                break;

            case hour >= 12 && hour < 17:
                period = "afternoon";
                break;

            case hour >= 17 && hour < 21:
                period = "evening";
                break;

            default:
                period = "night";
        }

        greetingMessage.textContent = greetings.getGreeting(period, name);
    });
}
// =====================================
// ASSIGNMENT 5: KEYBOARD NAVIGATION
// =====================================

const navLinks = document.querySelectorAll(
    ".main-navbar .nav-link, .main-navbar .nav-order"
);

document.addEventListener("keydown", function (event) {
    const activeElement = document.activeElement;

    if (
        activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA" ||
        activeElement.tagName === "SELECT"
    ) {
        return;
    }

    if (navLinks.length === 0) {
        return;
    }

    const currentIndex = Array.from(navLinks).indexOf(activeElement);

    if (event.key === "ArrowRight") {
        event.preventDefault();

        const nextIndex =
            currentIndex === -1
                ? 0
                : (currentIndex + 1) % navLinks.length;

        navLinks[nextIndex].focus();
    }

    if (event.key === "ArrowLeft") {
        event.preventDefault();

        const previousIndex =
            currentIndex === -1
                ? navLinks.length - 1
                : (currentIndex - 1 + navLinks.length) % navLinks.length;

        navLinks[previousIndex].focus();
    }
});

});
