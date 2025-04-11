document.addEventListener("DOMContentLoaded", function () {
    const userUUID = sessionStorage.getItem("userUUID");

    if (!userUUID) {
        alert("User ID not found. Please log in again.");
        return;
    }

    fetchReports(userUUID);
});

function fetchReports(userUUID) {
    fetch(`http://localhost/backend/routes/documents.php?user_uuid=${userUUID}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text(); // First, get response as text
        })
        .then(text => {
            try {
                return JSON.parse(text); // Try parsing the JSON
            } catch (error) {
                throw new Error("Invalid JSON response from server");
            }
        })
        .then(data => {
            const reportsGrid = document.querySelector(".reports-grid");

            if (data.success && data.documents.length > 0) {
                displayReports(data.documents, reportsGrid);
            } else {
                reportsGrid.innerHTML = "<p class='no-reports'>No reports found.</p>";
            }
        })
        .catch(error => {
            console.error("Error fetching reports:", error);
            document.querySelector(".reports-grid").innerHTML = "<p class='error-message'>Failed to load reports. Please try again later.</p>";
        });
}
async function fetchPatientDetails(uuid) {
    try {
        // Make the request to the backend
        const response = await fetch(`http://localhost/backend/routes/user.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'getUserByUUID',
                uuid: uuid
            })
        });

        const data = await response.json();

        // Check if the response is successful
        if (data.success) {
            // Update the HTML elements with the patient data
            document.getElementById('patientName').textContent = data.user.name;
            document.getElementById('patientEmail').textContent = data.user.email;
        } else {
            // Handle error if user is not found
            console.error('Error fetching user:', data.message);
            alert('User not found');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error fetching the patient details');
    }
}
const userID = sessionStorage.getItem('userUUID')
// Example usage: Call the function with a specific UUID
fetchPatientDetails(userID)
function displayReports(reports, reportsGrid) {
    reportsGrid.innerHTML = ""; // Clear existing content

    reports.forEach(report => {
        const reportCard = document.createElement("div");
        reportCard.classList.add("report-card");

        reportCard.innerHTML = `
            <h3>
                <i>📋</i> ${report.report_type}
            </h3>
            <p>Date: ${new Date(report.report_date).toLocaleDateString()}</p>
            <p>Doctor: ${report.doctor_name}</p>
            <p>Patient: ${report.patient_name}</p>
            <p>Test Results: ${report.test_results}</p>
            <p>Comments: ${report.comments}</p>
            <span class="report-status ${report.status === "Completed" ? "status-completed" : "status-pending"}">
                ${report.status}
            </span>
            <button class="btn" data-file="${report.file_path}">
                ${report.status === "Completed" ? "Download Report" : "View Details"}
            </button>
        `;

        reportsGrid.appendChild(reportCard);
    });

    attachButtonEvents();
}

function attachButtonEvents() {
    document.querySelectorAll(".btn").forEach(button => {
        button.addEventListener("click", function () {
            const filePath = this.getAttribute("data-file");

            if (filePath) {
                window.open(`http://localhost/backend/uploads/${filePath}`, "_blank");
            } else {
                alert("File not found.");
            }
        });
    });
}