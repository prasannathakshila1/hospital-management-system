document.addEventListener("DOMContentLoaded", function () {
    const feedbackTableBody = document.querySelector("#feedbackTable tbody");

    // Get All Feedback
    async function getAllFeedback() {
        try {
            const response = await fetch('http://localhost/backend/routes/feedback.php?route=getAllFeedback', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    displayFeedback(result.data);
                } else {
                    alert('No feedback found.');
                }
            } else {
                alert('Error fetching feedback: ' + response.statusText);
            }
        } catch (error) {
            console.error('Error fetching feedback:', error);
            alert('Failed to retrieve feedback.');
        }
    }

    // Function to display feedback in the table
    function displayFeedback(feedbackArray) {
        feedbackTableBody.innerHTML = ''; // Clear the current table before adding new feedback

        feedbackArray.forEach(feedback => {
            const row = document.createElement('tr');
            
            // Create table cells for each feedback property
            row.innerHTML = `
                <td>${feedback.id}</td>
                <td>${feedback.name}</td>
                <td>${feedback.feedback}</td>
                <td>${new Date(feedback.created_at).toLocaleDateString()}</td>
                <td><button onclick="resolveFeedback(${feedback.id})">Resolve</button></td>
            `;

            feedbackTableBody.appendChild(row);
        });
    }

    // Function to handle resolving feedback (you can add your own logic here)
    function resolveFeedback(feedbackId) {
        console.log("Resolving feedback with ID:", feedbackId);
        // You can send a request to mark the feedback as resolved in the backend, for example
    }

    // Get all feedback when the page loads
    getAllFeedback();
});
