// SIGN UP FORM
const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        const nameError = document.getElementById("nameError");
        const emailError = document.getElementById("emailError");
        const passwordError = document.getElementById("passwordError");
        const confirmPasswordError = document.getElementById("confirmPasswordError");
        const signupMessage = document.getElementById("signupMessage");

        nameError.textContent = "";
        emailError.textContent = "";
        passwordError.textContent = "";
        confirmPasswordError.textContent = "";
        signupMessage.textContent = "";

        let isValid = true;

        if (fullName.length < 2) {
            nameError.textContent = "Please enter your full name.";
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            emailError.textContent = "Please enter a valid email address.";
            isValid = false;
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

        if (!passwordRegex.test(password)) {
            passwordError.textContent =
                "Password must contain at least 8 characters, one letter and one number.";
            isValid = false;
        }

        if (password !== confirmPassword || confirmPassword === "") {
            confirmPasswordError.textContent = "Passwords do not match.";
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        let accounts = JSON.parse(localStorage.getItem("accounts")) || [];

        const existingAccount = accounts.find(
            account => account.email.toLowerCase() === email.toLowerCase()
        );

        if (existingAccount) {
            emailError.textContent = "This email is already registered.";
            return;
        }

        const newAccount = {
            fullName: fullName,
            email: email,
            password: password
        };

        accounts.push(newAccount);
        localStorage.setItem("accounts", JSON.stringify(accounts));

        signupMessage.textContent = "Account created successfully! Redirecting to Log In...";
        signupMessage.style.color = "green";

        signupForm.reset();

        setTimeout(function () {
            window.location.href = "login.html";
        }, 2000);
    });
}

// LOG IN FORM
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        const emailError = document.getElementById("loginEmailError");
        const passwordError = document.getElementById("loginPasswordError");
        const loginMessage = document.getElementById("loginMessage");

        emailError.textContent = "";
        passwordError.textContent = "";
        loginMessage.textContent = "";

        let isValid = true;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            emailError.textContent = "Please enter a valid email address.";
            isValid = false;
        }

        if (password.trim() === "") {
            passwordError.textContent = "Please enter your password.";
            isValid = false;
        }

        if (!isValid) return;

        const accounts = JSON.parse(localStorage.getItem("accounts")) || [];

        const user = accounts.find(account =>
            account.email.toLowerCase() === email.toLowerCase() &&
            account.password === password
        );

        if (!user) {
            loginMessage.textContent = "Incorrect email or password.";
            loginMessage.style.color = "red";
            return;
        }

        localStorage.setItem("currentUser", JSON.stringify({
            fullName: user.fullName,
            email: user.email
        }));

        loginMessage.textContent = "Login successful! Redirecting...";
        loginMessage.style.color = "green";

        setTimeout(function () {
            window.location.href = "profile.html";
        }, 1500);
    });
}

const profileName = document.getElementById("profileName");

if (profileName) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
        window.location.href = "login.html";
    } else {
        profileName.textContent = currentUser.fullName;

        document.getElementById("displayName").textContent =
            currentUser.fullName;

        document.getElementById("displayEmail").textContent =
            currentUser.email;
    }
}

const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
    logoutButton.addEventListener("click", function () {
        localStorage.removeItem("currentUser");
        window.location.href = "login.html";
    });
}