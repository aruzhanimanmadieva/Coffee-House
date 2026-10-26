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
    try {
        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioContextClass) return;

        const audio = new AudioContextClass();

        if (audio.state === "suspended") {
            audio.resume();
        }

        const now = audio.currentTime;

        [[660, 0], [880, 0.12]].forEach(function (note) {
            const oscillator = audio.createOscillator();
            const gain = audio.createGain();

            oscillator.type = "triangle";
            oscillator.frequency.setValueAtTime(
                note[0],
                now + note[1]
            );

            gain.gain.setValueAtTime(0.001, now + note[1]);
            gain.gain.linearRampToValueAtTime(
                0.22,
                now + note[1] + 0.025
            );
            gain.gain.exponentialRampToValueAtTime(
                0.001,
                now + note[1] + 0.24
            );

            oscillator.connect(gain);
            gain.connect(audio.destination);

            oscillator.start(now + note[1]);
            oscillator.stop(now + note[1] + 0.25);
        });

        window.setTimeout(function () {
            audio.close();
        }, 600);
    } catch (error) {
        console.info("Sound is unavailable in this browser.");
    }
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

    // =====================================
    // MENU: TEA PRODUCTS
    // =====================================

    const teaProducts = [
        {
            name: "Jasmine Green Tea",
            description: "Light green tea with a gentle floral aroma.",
            price: 1200,
            image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=85",
            icon: "🍵"
        },
        {
            name: "Earl Grey",
            description: "Classic black tea with fragrant bergamot.",
            price: 1100,
            image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=85",
            icon: "🫖"
        },
        {
            name: "Honey Ginger Tea",
            description: "A warming blend of ginger, honey and lemon.",
            price: 1300,
            image: "https://images.unsplash.com/photo-1563911892437-664e7f4b5c0c?auto=format&fit=crop&w=900&q=85",
            icon: "🍯"
        }
    ];

    const teaContainer = document.getElementById("teaProducts");
    const orderCountElement = document.getElementById("orderCount");
    const orderMessage = document.getElementById("orderMessage");
    const clearOrderButton = document.getElementById("clearOrder");

    let orderItems = [];

    if (teaContainer) {
        teaContainer.innerHTML = teaProducts.map(function (product) {
            return `
                <div class="col-12 col-md-6 col-lg-4 tea-product-item">
                    <article class="tea-card">
                        <img
                            class="tea-card-image"
                            src="${product.image}"
                            alt="${product.name}"
                            loading="lazy"
                            onerror="this.hidden=true; this.nextElementSibling.hidden=false"
                        >

                        <div class="tea-card-art" hidden aria-hidden="true">
                            ${product.icon}
                        </div>

                        <div class="card-body">
                            <h3 class="card-title">${product.name}</h3>
                            <p class="card-text">${product.description}</p>
                            <p class="tea-price">${product.price.toLocaleString("en-US")} ₸</p>

                            <button
                                class="btn btn-primary solace-btn tea-order-button"
                                type="button"
                                data-add-to-order
                                data-product-name="${product.name}"
                                data-product-price="${product.price}">
                                Add to Order
                            </button>
                        </div>
                    </article>
                </div>
            `;
        }).join("");
    }

    // =====================================
    // MENU: ADD ITEMS TO ORDER
    // =====================================

    function updateOrderSummary() {
        if (orderCountElement) {
            orderCountElement.textContent = orderItems.length;
        }

        if (orderMessage) {
            orderMessage.textContent = orderItems.length
                ? orderItems.map(function (item) {
                    return item.name;
                }).join(", ")
                : "Choose something lovely.";
        }
    }

    function addProductToOrder(name, price) {
        orderItems.push({
            name: name,
            price: Number(price) || 0
        });

        updateOrderSummary();

        if (orderMessage) {
            orderMessage.classList.remove("order-message-pop");
            void orderMessage.offsetWidth;
            orderMessage.classList.add("order-message-pop");
        }

        // Reuse the sound function already in your script.js.
        playSuccessSound();
    }

    // Event delegation works for both HTML cards and dynamic tea cards.
    document.addEventListener("click", function (event) {
        const button = event.target.closest("[data-add-to-order]");

        if (!button) return;

        event.preventDefault();

        const card = button.closest(
            ".menu-card, .dessert-card, .tea-card"
        );

        const title = card
            ? card.querySelector(".card-title")
            : null;

        const priceElement = card
            ? card.querySelector(".sizes strong, .tea-price, .card-body > strong")
            : null;

        const name = button.dataset.productName ||
            (title ? title.textContent.trim() : "SOLACE item");

        const price = button.dataset.productPrice ||
            (priceElement
                ? priceElement.textContent.replace(/[^0-9.]/g, "")
                : "0");

        addProductToOrder(name, price);

        const originalText = button.textContent;
        button.textContent = "Added ✓";

        window.setTimeout(function () {
            if (button.isConnected) {
                button.textContent = originalText;
            }
        }, 1000);
    });

    // Add buttons to dessert cards if they do not already have one.
    document.querySelectorAll(".dessert-card").forEach(function (card) {
        const body = card.querySelector(".card-body");

        if (!body || body.querySelector("[data-add-to-order]")) return;

        const title = card.querySelector(".card-title");
        const price = body.querySelector("strong");
        const button = document.createElement("button");

        button.type = "button";
        button.className = "btn btn-primary solace-btn mt-3";
        button.dataset.addToOrder = "";
        button.dataset.productName = title
            ? title.textContent.trim()
            : "Dessert";
        button.dataset.productPrice = price
            ? price.textContent.replace(/[^0-9.]/g, "")
            : "0";
        button.textContent = "Add to Order";

        body.appendChild(button);
    });

    if (clearOrderButton) {
        clearOrderButton.addEventListener("click", function () {
            orderItems = [];
            updateOrderSummary();
        });
    }

    // =====================================
    // MENU: CATEGORY FILTERS
    // =====================================

    const filterButtons = Array.from(
        document.querySelectorAll("[data-filter]")
    );

    const menuSections = Array.from(
        document.querySelectorAll("[data-menu-section]")
    );

    const pageProducts = Array.from(
        document.querySelectorAll(".menu-card, .dessert-card")
    ).map(function (card) {
        const section = card.closest("[data-menu-section]");
        const wrapper = card.closest(
            ".col-12, .col-md-6, .col-lg-4"
        ) || card.parentElement;

        return {
            card: card,
            wrapper: wrapper,
            category: section ? section.dataset.menuSection : "Other"
        };
    });

    function filterMenu(category) {
        let selectedCategory;

        switch (category) {
            case "Coffee":
                selectedCategory = "Coffee";
                break;
            case "Tea":
                selectedCategory = "Tea";
                break;
            case "Desserts":
                selectedCategory = "Desserts";
                break;
            default:
                selectedCategory = "All";
        }

        pageProducts.forEach(function (product) {
            product.wrapper.hidden =
                selectedCategory !== "All" &&
                product.category !== selectedCategory;
        });

        document.querySelectorAll(".tea-product-item").forEach(function (item) {
            item.hidden = selectedCategory !== "All" &&
                selectedCategory !== "Tea";
        });

        menuSections.forEach(function (section) {
            const shouldShow = selectedCategory === "All" ||
                section.dataset.menuSection === selectedCategory;

            section.hidden = !shouldShow;
            section.style.display = shouldShow ? "" : "none";
        });

        filterButtons.forEach(function (button) {
            const active = button.dataset.filter === selectedCategory;

            button.classList.toggle("is-active", active);
            button.setAttribute("aria-pressed", String(active));
        });
    }

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            filterMenu(button.dataset.filter);
        });
    });

    // =====================================
    // CONTACT FORM: THREE STEPS
    // =====================================

    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        const steps = Array.from(
            contactForm.querySelectorAll(".form-step")
        );

        const progressSteps = Array.from(
            contactForm.querySelectorAll("[data-progress-step]")
        );

        const stepStatus = document.getElementById("contactStepStatus");
        const message = document.getElementById("contactFormMessage");

        let currentStep = 1;

        const descriptions = {
            1: "Step 1 of 3 — tell us who you are.",
            2: "Step 2 of 3 — choose your preferences.",
            3: "Step 3 of 3 — leave us a message."
        };

        function showStep(stepNumber) {
            currentStep = stepNumber;

            steps.forEach(function (step) {
                const active = Number(step.dataset.step) === currentStep;
                step.hidden = !active;
                step.classList.toggle("is-visible", active);
            });

            progressSteps.forEach(function (step) {
                step.classList.toggle(
                    "is-current",
                    Number(step.dataset.progressStep) === currentStep
                );
            });

            if (stepStatus) {
                stepStatus.textContent = descriptions[currentStep];
            }

            if (message) {
                message.textContent = "";
                message.className = "contact-form-message";
            }
        }

        function validateStep() {
            const activeStep = steps.find(function (step) {
                return Number(step.dataset.step) === currentStep;
            });

            if (!activeStep) return false;

            let valid = true;

            activeStep.querySelectorAll(
                "input[required], select[required], textarea[required]"
            ).forEach(function (field) {
                field.classList.remove("is-invalid");

                if (!field.checkValidity() || !field.value.trim()) {
                    field.classList.add("is-invalid");
                    valid = false;
                }
            });

            if (!valid && message) {
                message.textContent =
                    "Please complete the required fields correctly.";
                message.className = "contact-form-message error";
            }

            return valid;
        }

        contactForm.querySelectorAll("[data-next-step]").forEach(function (button) {
            button.addEventListener("click", function () {
                if (validateStep() && currentStep < 3) {
                    showStep(currentStep + 1);
                }
            });
        });

        contactForm.querySelectorAll("[data-previous-step]").forEach(function (button) {
            button.addEventListener("click", function () {
                if (currentStep > 1) {
                    showStep(currentStep - 1);
                }
            });
        });

        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!validateStep()) return;

            if (message) {
                message.textContent =
                    "Thank you for contacting SOLACE! This demo does not send an email.";
                message.className = "contact-form-message success";
            }
        });

        showStep(1);
    }

});
