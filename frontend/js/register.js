document.addEventListener("DOMContentLoaded", function () {
    const registrationForm = document.querySelector(".registration-form");
    const submitButton = document.querySelector("button[type='submit']");

    // Function to validate the form
    function validateForm(form) {
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const password = form.password.value.trim();
        const confirmPassword = form["confirm-password"].value.trim();

        // Validate all fields
        if (!name || !email || !password || !confirmPassword) {
            alert("Please fill in all fields.");
            return false;
        }

        // Simple email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address.");
            return false;
        }

        // Validate password and confirm password match
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return false;
        }

        return true;
    }

// Handle form submission
async function handleFormSubmit(event) {
    event.preventDefault(); // Prevent form from submitting normally

    // Validate the form
    if (validateForm(registrationForm)) {
        const userData = {
            action: 'register',
            name: registrationForm.name.value,
            email: registrationForm.email.value,
            password: registrationForm.password.value,
            role: 'user'
        };

        try {
            // Send data to the backend for registration
            const response = await fetch('http://localhost/backend/routes/user.php', { // Update with the correct server address
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const result = await response.json();

            if (result.success) {
                alert("Registration successful!");
                window.location.href = "login.html"; // Redirect to the homepage or login page
            } else {
                alert("Error: " + result.message); // Display the error message
            }
        } catch (error) {
            console.error("Error during registration:", error);
            alert("Failed to register user.");
        }
    }
}



    // Attach form submit event listener
    registrationForm.addEventListener("submit", handleFormSubmit);
});
