// Add loading animation
function showLoading() {
    const tbody = document.getElementById('queryTableBody');
    tbody.innerHTML = `
        <tr class="loading-row">
            <td colspan="5">
                <div style="height: 40px;"></div>
            </td>
        </tr>
    `.repeat(5);
}

function fetchReports() {
    showLoading();
    
    fetch("http://localhost/backend/routes/reports.php")
        .then(response => response.json())
        .then(data => {
            console.log("Reports:", data);
            displayQueries(data);
        })
        .catch(error => console.error("Error fetching reports:", error));
}

function displayQueries(data) {
    if (!data || data.length === 0) {
        console.log('No reports to display');
        return;
    }

    const tbody = document.getElementById('queryTableBody');
    tbody.innerHTML = ''; // Clear the loading animation

    data.forEach(report => {
        const row = addRow(report);
        tbody.appendChild(row);
    });
}

// Add row with animation and click functionality
function addRow(data) {
    const row = document.createElement('tr');
    row.style.animationDelay = `${Math.random() * 0.5}s`;

    // Calculate response time based on the difference between the current time and data.date
    const responseTime = calculateResponseTime(data.date);

    row.innerHTML = `
        <td>#${data.id}</td>
        <td class="tooltip">
            <span class="message-preview">${data.message.length > 50 ? data.message.substring(0, 50) + '...' : data.message}</span>
            <span class="tooltip-text">${data.message}</span>
        </td>
        <td>${data.userId}</td>
        <td>${formatDate(data.date)}</td>
        <td>
            <div class="status-cell">
                <span class="status-indicator"></span>
                <span class="response-time ${getResponseTimeClass(responseTime)}">
                    ${responseTime}m response
                </span>
            </div>
        </td>
    `;

    // Add click event to toggle message preview
    const messagePreview = row.querySelector('.message-preview');
    messagePreview.addEventListener('click', () => {
        if (messagePreview.textContent.length > 50) {
            messagePreview.textContent = data.message.substring(0, 50) + '...';
        } else {
            messagePreview.textContent = data.message;
        }
    });

    return row;
}

// Function to calculate response time in minutes based on the difference from the current time
function calculateResponseTime(date) {
    const currentTime = new Date();
    const queryTime = new Date(date);
    const timeDifference = currentTime - queryTime; // Difference in milliseconds

    // Convert time difference to minutes
    const minutes = Math.floor(timeDifference / 60000); // 60,000 milliseconds in a minute
    return minutes >= 0 ? minutes : 'N/A'; // Ensure we don't get negative values
}

function getResponseTimeClass(time) {
    if (time === 'N/A') return 'no-response';  // Add a specific class for 'N/A'
    if (time <= 5) return 'fast';
    if (time <= 15) return 'medium'
}

// Date formatting function
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

// Initialize with loading animation
showLoading();
setTimeout(() => {
    displayQueries();
}, 1000);

// Add hover effect to table rows
document.querySelectorAll('tbody tr').forEach(row => {
    row.addEventListener('mouseover', () => {
        row.style.transform = 'scale(1.01)';
        row.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    });
    
    row.addEventListener('mouseout', () => {
        row.style.transform = 'scale(1)';
        row.style.boxShadow = 'none';
    });
});

fetchReports();
