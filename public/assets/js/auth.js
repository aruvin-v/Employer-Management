async function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        alert("Please enter both username and password.");
        return;
    }

    try {
        const response = await fetch('/login', {  // <-- Ensure this matches your backend
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Login successful! Redirecting...");
            window.location.href = "dashboard.html"; // Redirect after login
        } else {
            alert(data.message || "Login failed.");
        }
    } catch (error) {
        console.error("Error logging in:", error);
        alert("Failed to fetch user data.");
    }
}

async function registerUser() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        alert("Please enter both username and password.");
        return;
    }

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Registration successful! Redirecting to login...");
            window.location.href = "index.html"; // Redirect to login
        } else {
            alert(data.message || "Registration failed.");
        }
    } catch (error) {
        console.error("Error registering user:", error);
        alert("An error occurred while registering.");
    }
}

