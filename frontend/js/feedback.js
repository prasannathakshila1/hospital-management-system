document.addEventListener("DOMContentLoaded", function () {
    // Get the feedback form and feedback list container
    const feedbackForm = document.getElementById("feedbackForm");
    const feedbackList = document.getElementById("feedbackList"); // Assuming there is a div or ul to display feedbacks

    // Function to validate the form
    function validateForm(form) {
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const message = form.message.value.trim();

        if (!name || !email || !message) {
            alert("Please fill in all the fields.");
            return false;
        }

        // Simple email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address.");
            return false;
        }

        return true;
    }

    // Create Feedback - Submit Form
    async function handleFormSubmit(event) {
        event.preventDefault(); // Prevent default form submission
    
        // Validate form inputs
        if (!validateForm(feedbackForm)) {
            return;
        }
    
        // Gather form data
        const feedbackData = {
            action: 'register',
            name: feedbackForm.name.value,
            email: feedbackForm.email.value,
            feedback: feedbackForm.message.value,
        };
    
        try {
            const response = await fetch('http://localhost/backend/routes/feedback.php?route=submitFeedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(feedbackData),
            });
    
            // Check if the response is OK (status 200)
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    alert('Feedback submitted successfully!');
                    feedbackForm.reset(); // Reset form fields
                } else {
                    alert('Error: ' + result.message);
                }
            } else {
                // Handle errors returned by the server
                alert('Error: ' + response.statusText);
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Failed to submit feedback.');
        }
    }
    feedbackForm.addEventListener("submit", handleFormSubmit);
});
