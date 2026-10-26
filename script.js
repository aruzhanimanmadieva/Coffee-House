/* SOLACE Coffee House — shared JavaScript
   Assignment 5: DOM manipulation, events, arrays, objects, callbacks, switch, sound and animation.
*/
document.addEventListener("DOMContentLoaded", function () {
    // ---------- Existing project: account form validation (about.html) ----------
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", function (event) {
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
            if (![name, email, password, confirmPassword, nameError, emailError, passwordError, confirmError, message].every(Boolean)) return;
            [nameError, emailError, passwordError, confirmError, message].forEach(function (element) { element.textContent = ""; });
            [name, email, password, confirmPassword].forEach(function (input) { input.classList.remove("invalid"); });
            let valid = true;
            if (name.value.trim().length < 2) { nameError.textContent = "Please enter your name."; name.classList.add("invalid"); valid = false; }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { emailError.textContent = "Please enter a valid email."; email.classList.add("invalid"); valid = false; }
            if (password.value.length < 8) { passwordError.textContent = "Password must contain at least 8 characters."; password.classList.add("invalid"); valid = false; }
            if (!confirmPassword.value) { confirmError.textContent = "Please confirm your password."; confirmPassword.classList.add("invalid"); valid = false; }
            else if (password.value !== confirmPassword.value) { confirmError.textContent = "Passwords do not match."; confirmPassword.classList.add("invalid"); valid = false; }
            message.textContent = valid ? "Success! Your form has been validated." : "Please correct the errors above.";
            message.className = valid ? "form-message success" : "form-message error";
            if (valid) signupForm.reset();
        });
    }

    // ---------- FAQ accordion: one answer open at a time; first answer open by default ----------
    const faq = document.getElementById("solace-faq");
    if (faq) {
        const questions = Array.from(faq.querySelectorAll(".solace-faq__question"));

        function setFaqState(button, shouldOpen) {
            const answer = document.getElementById(button.getAttribute("aria-controls"));
            if (!answer) return;
            button.setAttribute("aria-expanded", String(shouldOpen));
            answer.hidden = !shouldOpen;
            answer.style.maxHeight = shouldOpen ? answer.scrollHeight + "px" : "0";
            const icon = button.querySelector(".solace-faq__icon");
            if (icon) icon.textContent = shouldOpen ? "−" : "+";
        }

        questions.forEach(function (button, index) {
            const answer = document.getElementById(button.getAttribute("aria-controls"));
            if (answer) {
                answer.hidden = true;
                answer.style.overflow = "hidden";
                answer.style.maxHeight = "0";
                answer.style.transition = "max-height .3s ease";
            }
            button.setAttribute("aria-expanded", "false");
            button.addEventListener("click", function () {
                const wasOpen = button.getAttribute("aria-expanded") === "true";
                questions.forEach(function (otherButton) { setFaqState(otherButton, false); });
                if (!wasOpen) setFaqState(button, true);
            });
        });

        if (questions.length) setFaqState(questions[0], true);
        window.addEventListener("resize", function () {
            questions.forEach(function (button) {
                if (button.getAttribute("aria-expanded") === "true") setFaqState(button, true);
            });
        });
    }

    // ---------- Existing project: subscription popup (index.html) ----------
    const popup = document.getElementById("popupOverlay");
    const openPopupButton = document.getElementById("openPopup");
    const closePopupButton = document.getElementById("closePopup");
    const subscriptionForm = document.getElementById("subscriptionForm");
    function closePopup() {
        if (popup) { popup.classList.remove("active"); document.body.classList.remove("popup-open"); }
    }
    if (popup && openPopupButton) openPopupButton.addEventListener("click", function () { popup.classList.add("active"); document.body.classList.add("popup-open"); });
    if (closePopupButton) closePopupButton.addEventListener("click", closePopup);
    if (popup) popup.addEventListener("click", function (event) { if (event.target === popup) closePopup(); });
    document.addEventListener("keydown", function (event) { if (event.key === "Escape") closePopup(); });
    if (subscriptionForm) {
        subscriptionForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const subscriberName = document.getElementById("subscriberName");
            const subscriberEmail = document.getElementById("subscriberEmail");
            const subscriptionMessage = document.getElementById("subscriptionMessage");
            if (!subscriberName || !subscriberEmail || !subscriptionMessage) return;
            if (!subscriberName.value.trim()) { subscriptionMessage.textContent = "Please enter your name."; return; }
            if (!subscriberEmail.checkValidity()) { subscriptionMessage.textContent = "Please enter a valid email address."; return; }
            subscriptionMessage.textContent = "Thank you for subscribing to our Coffee Club!";
            playNotificationSound();
            subscriptionForm.reset();
        });
    }

    // ---------- Background mood buttons: update the whole menu page, including gallery ----------
    const moodButtons = document.querySelectorAll(".mood-button");
    const defaultMoodColor = "#fffaf3";
    const moodTargets = document.querySelectorAll(
        ".menu-hero, .menu-filter-section, #coffee-menu, #tea-menu, .color-changer-section, #desserts, #gallery"
    );
    function applyMoodColor(color) {
        document.documentElement.style.setProperty("--cream-light", color);
        document.documentElement.style.setProperty("--cream", color);
        document.documentElement.style.setProperty("--menu-mood-bg", color);
        moodTargets.forEach(function (section) { section.style.backgroundColor = color; });
    }
    moodButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const color = button.dataset.color;
            if (button.dataset.reset === "true") {
                applyMoodColor(defaultMoodColor);
            } else if (color) {
                applyMoodColor(color);
            }
            moodButtons.forEach(function (item) { item.setAttribute("aria-pressed", String(item === button)); });
        });
    });

    // ---------- Existing project: live date and time (index.html) ----------
    const dateElement = document.getElementById("currentDate");
    const timeElement = document.getElementById("currentTime");
    function updateDateTime() {
        const now = new Date();
        if (dateElement) dateElement.textContent = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
        if (timeElement) timeElement.textContent = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
    }
    updateDateTime();
    if (dateElement || timeElement) window.setInterval(updateDateTime, 1000);

    // ---------- Assignment 5: product data as an array of objects ----------
    const teaProducts = [
        { name: "Jasmine Green Tea", category: "Tea", description: "Light green tea with a gentle floral aroma.", price: 1200, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrd-66HVra6UW7l2sLfXiz-HhIhG7oxFOgw0En5Z6cHw&s=10", icon: "🍵" },
        { name: "Earl Grey", category: "Tea", description: "Classic black tea with fragrant bergamot.", price: 1100, image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=85", icon: "🫖" },
        { name: "Honey Ginger Tea", category: "Tea", description: "A warming blend of ginger, honey and lemon.", price: 1300, image: "https://dutchmansgold.com/cdn/shop/articles/recipe_4effd57d-f879-4b7c-ac7e-238e37c9c08b_2048x.progressive.png.jpg?v=1767721973", icon: "🍯" }
    ];
    const teaContainer = document.getElementById("teaProducts");
    const orderCountElement = document.getElementById("orderCount");
    const orderMessage = document.getElementById("orderMessage");
    const clearOrderButton = document.getElementById("clearOrder");
    const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
    const menuSections = document.querySelectorAll("[data-menu-section]");
    // Read the existing HTML cards into a structured array of product objects.
    const pageProducts = Array.from(document.querySelectorAll(".menu-card, .dessert-card")).map(function (card) {
        const section = card.closest("[data-menu-section]");
        const title = card.querySelector(".card-title");
        return {
            name: title ? title.textContent.trim() : "SOLACE item",
            category: section ? section.dataset.menuSection : "Other",
            card: card,
            wrapper: card.closest(".col-12, .col-md-6, .col-lg-4") || card.parentElement
        };
    });
    let orderItems = [];

    // map() transforms the tea objects into HTML card strings; join() renders them in one pass.
    if (teaContainer) {
        teaContainer.innerHTML = teaProducts.map(function (product) {
            return '<div class="col-12 col-md-6 col-lg-4 tea-product-item"><article class="tea-card"><img class="tea-card-image" src="' + product.image + '" alt="' + product.name + ' served in a cup" loading="lazy" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><div class="tea-card-art" aria-hidden="true" hidden>' + product.icon + '</div><div class="card-body"><h3 class="card-title">' + product.name + '</h3><p class="card-text">' + product.description + '</p><p class="tea-price">' + product.price.toLocaleString("en-US") + ' ₸</p><button class="btn btn-primary solace-btn tea-order-button" type="button" data-add-to-order data-product-name="' + product.name + '" data-product-price="' + product.price + '">Add to Order</button></div></article></div>';
        }).join("");
    }

    // Web Audio notification tone. It is triggered by the user's submit/click action.
    let audioContext = null;
    async function playNotificationSound() {
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return;
            if (!audioContext) audioContext = new AudioContextClass();
            if (audioContext.state === "suspended") await audioContext.resume();
            const now = audioContext.currentTime;
            [[660, 0], [880, 0.12]].forEach(function (note) {
                const oscillator = audioContext.createOscillator();
                const gain = audioContext.createGain();
                oscillator.type = "triangle";
                oscillator.frequency.setValueAtTime(note[0], now + note[1]);
                gain.gain.setValueAtTime(0.0001, now + note[1]);
                gain.gain.exponentialRampToValueAtTime(0.22, now + note[1] + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + note[1] + 0.24);
                oscillator.connect(gain);
                gain.connect(audioContext.destination);
                oscillator.start(now + note[1]);
                oscillator.stop(now + note[1] + 0.26);
            });
        } catch (error) {
            console.info("Sound is unavailable in this browser.", error);
        }
    }

    function updateOrderSummary() {
        if (orderCountElement) orderCountElement.textContent = String(orderItems.length);
        if (orderMessage) {
            orderMessage.textContent = orderItems.length ? orderItems.map(function (item) { return item.name; }).join(", ") : "Choose something lovely.";
        }
    }

    function addProductToOrder(name, price) {
        orderItems.push({ name: name, price: Number(price) || 0 });
        updateOrderSummary();
        if (orderMessage) {
            orderMessage.classList.remove("order-message-pop");
            void orderMessage.offsetWidth;
            orderMessage.classList.add("order-message-pop");
        }
        playNotificationSound();
    }

    // Use event delegation so existing and dynamically created product buttons both work.
    document.addEventListener("click", function (event) {
        const addButton = event.target.closest("[data-add-to-order], .menu-card a.solace-btn");
        if (!addButton) return;
        event.preventDefault();
        const card = addButton.closest(".menu-card, .dessert-card, .tea-card");
        const nameElement = card ? card.querySelector(".card-title") : null;
        const priceElement = card ? card.querySelector(".sizes strong, .tea-price, .card-body > strong") : null;
        const name = addButton.dataset.productName || (nameElement ? nameElement.textContent.trim() : "SOLACE item");
        const price = addButton.dataset.productPrice || (priceElement ? priceElement.textContent.replace(/[^0-9.]/g, "") : "0");
        addProductToOrder(name, price);
        const oldText = addButton.textContent.trim();
        addButton.textContent = "Added ✓";
        window.setTimeout(function () { if (addButton.isConnected) addButton.textContent = oldText; }, 900);
    });

    // Add a consistent order button to the existing dessert cards without replacing their markup.
    document.querySelectorAll(".dessert-card").forEach(function (card) {
        const body = card.querySelector(".card-body");
        if (body && !body.querySelector("[data-add-to-order]")) {
            const title = card.querySelector(".card-title");
            const price = body.querySelector("strong");
            const button = document.createElement("button");
            button.type = "button";
            button.className = "btn btn-primary solace-btn mt-3";
            button.dataset.addToOrder = "";
            button.dataset.productName = title ? title.textContent.trim() : "Dessert";
            button.dataset.productPrice = price ? price.textContent.replace(/[^0-9.]/g, "") : "0";
            button.textContent = "Add to order";
            body.appendChild(button);
        }
    });

    if (clearOrderButton) clearOrderButton.addEventListener("click", function () { orderItems = []; updateOrderSummary(); });

    // switch statement handles the category selection; filter() selects the matching sections.
    function filterMenu(category) {
        let selectedCategory;
        switch (category) {
            case "Coffee": selectedCategory = "Coffee"; break;
            case "Tea": selectedCategory = "Tea"; break;
            case "Desserts": selectedCategory = "Desserts"; break;
            case "All":
            default: selectedCategory = "All";
        }
        const matchingProducts = pageProducts.filter(function (product) {
            return selectedCategory === "All" || product.category === selectedCategory;
        });
        const matchingTeaProducts = teaProducts.filter(function (product) {
            return selectedCategory === "All" || product.category === selectedCategory;
        });
        pageProducts.forEach(function (product) {
            product.wrapper.hidden = !matchingProducts.includes(product);
        });
        document.querySelectorAll(".tea-product-item").forEach(function (wrapper) {
            const title = wrapper.querySelector(".card-title");
            wrapper.hidden = !matchingTeaProducts.some(function (product) {
                return title && product.name === title.textContent.trim();
            });
        });
        const visibleSections = Array.from(menuSections).filter(function (section) {
            return selectedCategory === "All" || section.dataset.menuSection === selectedCategory;
        });
        menuSections.forEach(function (section) {
            section.hidden = !visibleSections.includes(section);
            section.style.display = section.hidden ? "none" : "";
        });
        filterButtons.forEach(function (button) {
            const isActive = button.dataset.filter === selectedCategory;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });
    }
    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const category = button.dataset.filter;
            filterMenu(category);
            // Bring the matching products into view so the user immediately sees the filtered results.
            const targetId = category === "Tea" ? "tea-menu" : category === "Desserts" ? "desserts" : "coffee-menu";
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                window.setTimeout(function () {
                    targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 30);
            }
        });
    });

    // Keyboard navigation: left/right arrows move between the menu category buttons.
    const filterGroup = document.querySelector(".menu-filter-controls");
    if (filterGroup && filterButtons.length) {
        filterGroup.addEventListener("keydown", function (event) {
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
            const currentIndex = filterButtons.indexOf(document.activeElement);
            if (currentIndex < 0) return;
            event.preventDefault();
            let nextIndex = currentIndex;
            if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % filterButtons.length;
            if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + filterButtons.length) % filterButtons.length;
            if (event.key === "Home") nextIndex = 0;
            if (event.key === "End") nextIndex = filterButtons.length - 1;
            filterButtons[nextIndex].focus();
        });
    }

    // ---------- Assignment 5: multi-step contact form ----------
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        const steps = Array.from(contactForm.querySelectorAll(".form-step"));
        const progressSteps = Array.from(contactForm.querySelectorAll("[data-progress-step]"));
        const stepStatus = document.getElementById("contactStepStatus");
        const formMessage = document.getElementById("contactFormMessage");
        let currentStep = 1;
        const stepDescriptions = {
            1: "Step 1 of 3 — tell us who you are.",
            2: "Step 2 of 3 — choose your preferences.",
            3: "Step 3 of 3 — leave us a message."
        };
        function showStep(step) {
            currentStep = Math.min(3, Math.max(1, step));
            steps.forEach(function (element) {
                const isCurrent = Number(element.dataset.step) === currentStep;
                element.hidden = !isCurrent;
                element.classList.toggle("is-visible", isCurrent);
            });
            progressSteps.forEach(function (element) {
                element.classList.toggle("is-current", Number(element.dataset.progressStep) === currentStep);
            });
            if (stepStatus) stepStatus.textContent = stepDescriptions[currentStep];
            if (formMessage) { formMessage.textContent = ""; formMessage.className = "contact-form-message"; }
            const firstField = steps[currentStep - 1].querySelector("input:not([type=radio]):not([type=checkbox]), select, textarea");
            if (firstField) firstField.focus({ preventScroll: true });
        }
        function validateCurrentStep() {
            const activeStep = steps[currentStep - 1];
            const fields = Array.from(activeStep.querySelectorAll("input, select, textarea")).filter(function (field) {
                return field.type !== "radio" && field.type !== "checkbox" && field.type !== "color";
            });
            let valid = true;
            fields.forEach(function (field) {
                field.classList.remove("is-invalid");
                if (field.required && !field.value.trim()) {
                    field.classList.add("is-invalid");
                    valid = false;
                } else if (field.type === "email" && field.value && !field.checkValidity()) {
                    field.classList.add("is-invalid");
                    valid = false;
                }
            });
            if (!valid && formMessage) {
                formMessage.textContent = "Please complete the required fields correctly before continuing.";
                formMessage.className = "contact-form-message error";
                const firstInvalid = activeStep.querySelector(".is-invalid");
                if (firstInvalid) firstInvalid.focus();
            }
            return valid;
        }
        contactForm.querySelectorAll("[data-next-step]").forEach(function (button) {
            button.addEventListener("click", function () { if (validateCurrentStep()) showStep(currentStep + 1); });
        });
        contactForm.querySelectorAll("[data-previous-step]").forEach(function (button) {
            button.addEventListener("click", function () { showStep(currentStep - 1); });
        });
        // Callback displays the result without reloading the page; no backend is connected.
        function showSubmissionResult(success) {
            if (!formMessage) return;
            formMessage.textContent = success
                ? "Thank you for contacting SOLACE! Your message has been checked in this demo. No email was sent because no backend is connected."
                : "Something went wrong. Please try again.";
            formMessage.className = success ? "contact-form-message success" : "contact-form-message error";
        }
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();
            if (!validateCurrentStep()) return;
            // The callback is intentionally local: the assignment uses a static GitHub Pages website.
            window.setTimeout(function () {
                showSubmissionResult(true);
                contactForm.querySelectorAll("button").forEach(function (button) { button.disabled = true; });
            }, 150);
        });
        showStep(1);
    }


    // ---------- Assignment 5: interactive rating ----------
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
                item.classList.toggle("selected", Number(item.dataset.rating) <= rating);
            });
            if (ratingMessage) ratingMessage.textContent = ratingTexts[rating - 1] || "Thank you for your feedback!";
        });
    });

    // ---------- Assignment 5: dynamic greeting ----------
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
            if (!name) {
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

    // ---------- Assignment 5: left/right arrows navigate between site pages ----------
    const pageLinks = Array.from(document.querySelectorAll(".main-navbar .nav-link"));
    const pageOrder = pageLinks.filter(function (link) {
        return /^(Home|Menu|About Us|Contact)$/i.test(link.textContent.trim());
    });
    document.addEventListener("keydown", function (event) {
        if (!pageOrder.length || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        if (document.querySelector(".popup-overlay.active, #popupOverlay.active")) return;
        const activeElement = document.activeElement;
        if (activeElement && (
            ["INPUT", "TEXTAREA", "SELECT"].includes(activeElement.tagName) ||
            activeElement.isContentEditable ||
            activeElement.matches(".rating-star, .carousel-control-prev, .carousel-control-next, .carousel-indicators button, .menu-filter-controls button")
        )) return;
        const currentFile = window.location.pathname.split("/").pop() || "index.html";
        const currentIndex = pageOrder.findIndex(function (link) {
            return new URL(link.href, window.location.href).pathname.split("/").pop() === currentFile;
        });
        if (currentIndex < 0) return;
        event.preventDefault();
        const nextIndex = event.key === "ArrowRight"
            ? (currentIndex + 1) % pageOrder.length
            : (currentIndex - 1 + pageOrder.length) % pageOrder.length;
        window.location.href = pageOrder[nextIndex].href;
    });
});
