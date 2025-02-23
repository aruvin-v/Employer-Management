const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// File paths
const usersFile = path.join(__dirname, '../data/users.json');
const employersFile = path.join(__dirname, '../data/employers.json');

/* ------------------- User Registration ------------------- */
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    fs.readFile(usersFile, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: "Error reading users file." });

        let users = [];
        try {
            users = JSON.parse(data);
        } catch (parseError) {
            console.error("Error parsing users.json:", parseError);
        }

        // Check if username exists
        if (users.some(user => user.username === username)) {
            return res.status(400).json({ message: "Username already exists." });
        }

        // Add new user
        users.push({ username, password });

        fs.writeFile(usersFile, JSON.stringify(users, null, 2), (err) => {
            if (err) return res.status(500).json({ message: "Error saving user." });
            res.json({ message: "User registered successfully!" });
        });
    });
});

/* ------------------- User Login ------------------- */
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    fs.readFile(usersFile, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: "Error reading users file." });

        let users = [];
        try {
            users = JSON.parse(data);
        } catch (parseError) {
            console.error("Error parsing users.json:", parseError);
        }

        const user = users.find(user => user.username === username && user.password === password);
        if (user) {
            res.json({ message: "Login successful!" });
        } else {
            res.status(401).json({ message: "Invalid credentials." });
        }
    });
});

/* ------------------- Fetch Employer Data ------------------- */
// Fetch all employers
app.get('/employers', (req, res) => {
    fs.readFile(employersFile, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading employers file:", err);
            return res.status(500).json({ message: "Error reading employers file" });
        }
        try {
            const employers = JSON.parse(data);
            res.json(employers);
        } catch (parseError) {
            console.error("Error parsing employers.json:", parseError);
            res.status(500).json({ message: "Error parsing employer data" });
        }
    });
});

// Route to delete an employer
app.get('/employers/:id', (req, res) => {
    fs.readFile(employersFile, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: "Error reading employers file" });

        const employers = JSON.parse(data);
        const employer = employers.find(emp => emp.id === req.params.id);

        if (!employer) return res.status(404).json({ message: "Employer not found" });

        res.json(employer);
    });
});

// Add employer (POST)
app.post('/employers', (req, res) => {
    const newEmployer = req.body;
    console.log("Received new employer:", newEmployer); // Debugging

    fs.readFile(employersFile, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading employers.json:", err);
            return res.status(500).json({ message: "Error reading employers file" });
        }

        let employers = [];
        try {
            employers = JSON.parse(data);
        } catch (parseError) {
            console.error("Error parsing employers.json:", parseError);
            return res.status(500).json({ message: "Error parsing employer data" });
        }

        // Add new employer
        employers.push(newEmployer);

        fs.writeFile(employersFile, JSON.stringify(employers, null, 2), (err) => {
            if (err) {
                console.error("Error writing to employers.json:", err);
                return res.status(500).json({ message: "Error saving employer" });
            }

            console.log("Employer added successfully:", newEmployer);
            res.status(201).json({ message: "Employer added successfully" });
        });
    });
});

app.delete('/employers/:id', (req, res) => {
    console.log("Delete request received for employer ID:", req.params.id);

    fs.readFile(employersFile, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading employers.json:", err);
            return res.status(500).json({ message: "Error reading employers file" });
        }

        let employers = JSON.parse(data);
        const employerId = req.params.id;

        // Check if employer exists
        const employerIndex = employers.findIndex(emp => emp.id === employerId);
        console.log("Employer index found:", employerIndex);

        if (employerIndex === -1) {
            console.error("Employer not found:", employerId);
            return res.status(404).json({ message: "Employer not found" });
        }

        // Remove employer
        employers.splice(employerIndex, 1);

        // Write updated data back
        fs.writeFile(employersFile, JSON.stringify(employers, null, 2), (err) => {
            if (err) {
                console.error("Error updating employers.json:", err);
                return res.status(500).json({ message: "Error updating employer file" });
            }

            console.log("Employer deleted successfully:", employerId);
            res.json({ message: "Employer deleted successfully" });
        });
    });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));