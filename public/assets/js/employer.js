document.addEventListener('DOMContentLoaded', fetchEmployers);
document.addEventListener('DOMContentLoaded', loadEmployerData);

// Function to validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to validate phone number (only digits and length 10-15)
function isValidPhone(phone) {
    const phoneRegex = /^\d{10,15}$/;
    return phoneRegex.test(phone);
}

// Function to validate form input before submitting
function validateEmployerForm(name, email, phone, position) {
    if (!name.trim()) {
        alert("Name is required.");
        return false;
    }
    if (!position.trim()) {
        alert("Position is required.");
        return false;
    }
    if (!email.trim() || !isValidEmail(email)) {
        alert("Please enter a valid email.");
        return false;
    }
    if (!phone.trim() || !isValidPhone(phone)) {
        alert("Please enter a valid phone number (10-15 digits).");
        return false;
    }
    return true;
}

async function loadEmployerData() {
    const urlParams = new URLSearchParams(window.location.search);
    const employerId = urlParams.get('id');

    if (!employerId) {
        console.error("No employer ID found in URL.");
        return;
    }

    try {
        const response = await fetch('/employers');
        if (!response.ok) throw new Error("Failed to fetch employer data");

        const employers = await response.json();
        const employer = employers.find(emp => emp.id === employerId);

        if (!employer) {
            console.error("Employer not found.");
            return;
        }

        // Populate form fields
        document.getElementById('employerId').value = employer.id || '';
        document.getElementById('employerName').value = employer.name || '';
        document.getElementById('employerPosition').value = employer.position || '';
        document.getElementById('employerEmail').value = employer.email || '';
        document.getElementById('employerPhone').value = employer.phone || '';
        document.getElementById('employerAddress').value = employer.address || '';
    } catch (error) {
        console.error("Error fetching employer:", error);
    }
}

async function fetchEmployers() {
    try {
        const response = await fetch('/employers');
        if (!response.ok) throw new Error("Failed to fetch employer data");

        const employers = await response.json();
        displayEmployers(employers);
    } catch (error) {
        console.error("Error fetching employers:", error);
        document.getElementById('employerTable').innerHTML += '<tr><td colspan="3">Error loading employer data.</td></tr>';
    }
}

function displayEmployers(employers) {
    const employerTable = document.getElementById('employerTable');
    employerTable.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Email</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Actions</th>
        </tr>
    `; // Reset table before populating

    if (employers.length === 0) {
        employerTable.innerHTML += '<tr><td colspan="3">No employers found.</td></tr>';
        return;
    }

    employers.forEach(employer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employer.name}</td>
            <td>${employer.position}</td>
            <td>${employer.email}</td>
            <td>${employer.address}</td>
            <td>${employer.phone}</td>
            <td>
                <button onclick="editEmployer('${employer.id}')" class="btn">Edit</button>
                <button onclick="deleteEmployer('${employer.id}')" class = "delete-btn">Delete</button>
            </td>
        `;
        employerTable.appendChild(row);
    });
}

function editEmployer(employerId) {
  location.href = `edit-employer.html?id=${employerId}`;
}

async function deleteEmployer(employerId) {
  console.log("Attempting to delete employer with ID:", employerId); // Debugging

  if (!confirm("Are you sure you want to delete this employer?")) return;

  try {
      const response = await fetch(`/employers/${employerId}`, { 
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
      });

      console.log("Server response:", response.status); // Debugging

      if (!response.ok) {
          const errorData = await response.json();
          console.error("Server error message:", errorData.message);
          throw new Error("Failed to delete employer: " + errorData.message);
      }

      alert("Employer deleted successfully.");
      location.reload();
  } catch (error) {
      console.error("Error deleting employer:", error);
      alert("Error deleting employer.");
  }
}

async function addEmployer() {
  const employerName = document.getElementById('employerName').value.trim();
  const employerPosition = document.getElementById('employerPosition').value.trim();
  const employerEmail = document.getElementById('employerEmail').value;
  const employerPhone = document.getElementById('employerPhone').value;
  const employerAddress = document.getElementById('employerAddress').value;

  if (!employerName || !employerPosition) {
      alert("Please enter both name and position.");
      return;
  }

  if (!validateEmployerForm(employerName, employerEmail, employerPhone, employerPosition)) return;

  const newEmployer = { 
      id: Date.now().toString(), // Generate unique ID
      name: employerName, 
      position: employerPosition ,
      email: employerEmail,
      phone: employerPhone,
      address: employerAddress
  };

  try {
      const response = await fetch('/employers', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEmployer)
      });

      console.log("Server response:", response.status); // Debugging

      if (!response.ok) {
          const errorData = await response.json();
          console.error("Server error message:", errorData.message);
          throw new Error("Failed to add employer: " + errorData.message);
      }

      alert("Employer added successfully.");
      window.location.href = 'dashboard.html';
  } catch (error) {
      console.error("Error adding employer:", error);
      alert("Error adding employer.");
  }
}

async function updateEmployer() {
    const employerId = document.getElementById('employerId').value;
    const employerName = document.getElementById('employerName').value;
    const employerPosition = document.getElementById('employerPosition').value;
    const employerEmail = document.getElementById('employerEmail').value;
    const employerPhone = document.getElementById('employerPhone').value;
    const employerAddress = document.getElementById('employerAddress').value;

    if (!validateEmployerForm(employerName, employerEmail, employerPhone, employerPosition)) return;

    const updatedEmployer = {
        id: employerId,
        name: employerName,
        position: employerPosition,
        email: employerEmail,
        phone: employerPhone,
        address: employerAddress
    };

    try {
        const response = await fetch(`/employers/${employerId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedEmployer)
        });

        if (!response.ok) throw new Error("Failed to update employer.");

        alert("Employer updated successfully.");
        window.location.href = 'dashboard.html'; // Redirect to dashboard
    } catch (error) {
        console.error("Error updating employer:", error);
        alert("Error updating employer.");
    }
}