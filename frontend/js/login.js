document.querySelector('.login-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Grab the input values
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Validate fields
    if (!email) {
        showError('email-error', 'Please enter your email.');
        return;
    } else {
        hideError('email-error');
    }

    if (!password) {
        showError('password-error', 'Please enter your password.');
        return;
    } else {
        hideError('password-error');
    }

    // Prepare login data
    const loginData = {
        action: 'login',
        email: email,
        password: password,
    };

    try {
        // Send login request
        const response = await fetch('http://localhost/backend/routes/user.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });

        if (response.ok) {
            const result = await response.json();
            console.log('response',response)
            console.log('result',result.userData.uuid)
            if (result.success) {
                alert('Login successful!');
                sessionStorage.setItem('userUUID', result.userData.uuid);
                sessionStorage.setItem('userRole', result.userData.role);
                window.location.href = "index.html"; // Redirect on success
            } else {
                showError('password-error', result.message);
            }
        } else {
            alert('Error: ' + response.statusText);
        }
    } catch (error) {
        console.error('Error logging in:', error);
        alert('Failed to login.');
    }
});

// Show error function
function showError(id, message) {
    const errorElement = document.getElementById(id);
    errorElement.textContent = message;
    errorElement.style.color = 'red';
}

// Hide error function
function hideError(id) {
    const errorElement = document.getElementById(id);
    errorElement.textContent = '';
}
