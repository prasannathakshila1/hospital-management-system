// Sample documents data structure (normally this would come from a backend)
const sampleDocuments = {
    'patient1': [
        { id: 1, title: 'Blood Test Report', type: 'lab', date: '2024-02-01', fileType: 'pdf' },
        { id: 2, title: 'Chest X-Ray', type: 'xray', date: '2024-01-15', fileType: 'jpg' }
    ],
    'patient2': [
        { id: 3, title: 'MRI Scan', type: 'mri', date: '2024-02-03', fileType: 'pdf' }
    ],
    'patient3': [
        { id: 4, title: 'CT Scan Report', type: 'ct', date: '2024-01-20', fileType: 'pdf' },
        { id: 5, title: 'Lab Results', type: 'lab', date: '2024-02-05', fileType: 'pdf' }
    ]
};

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeForm();
    fetchUsers();
    setupDropZone();
    populateUserSelect();
});

// Initialize form elements and event listeners
function initializeForm() {
    const submitButton = document.getElementById('submitButton');
    submitButton.addEventListener('click', handleSubmit);

    // Set max date to today
    const dateInput = document.getElementById('reportDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('max', today);
}

// Populate user select dropdown
function populateUserSelect() {
    const userSelect = document.getElementById('user');
    Object.keys(sampleDocuments).forEach(patientId => {
        const option = document.createElement('option');
        option.value = patientId;
        option.textContent = patientId;
        userSelect.appendChild(option);
    });
}

// Set up drag and drop functionality
function setupDropZone() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');

    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length) {
            handleFileSelection(files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFileSelection(e.target.files[0]);
        }
    });
}

// Handle file selection
function handleFileSelection(file) {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
        alert('Please upload only PDF, JPG, or PNG files.');
        return;
    }
    
    // Update drop zone text to show selected file
    const dropZone = document.getElementById('dropZone');
    dropZone.querySelector('p').textContent = `Selected: ${file.name}`;
}

// Load user documents
function loadUserDocuments() {
    const userId = document.getElementById('user').value;
    const documentList = document.getElementById('documentList');
    documentList.innerHTML = '';

    if (!userId || !sampleDocuments[userId]) return;

    sampleDocuments[userId].forEach(doc => {
        const li = document.createElement('li');
        li.className = 'document-item';
        
        const icon = getFileTypeIcon(doc.fileType);
        const date = new Date(doc.date).toLocaleDateString();
        
        li.innerHTML = `
            <div class="document-icon">
                <i class="${icon}"></i>
            </div>
            <div class="document-info">
                <h3>${doc.title}</h3>
                <p>Type: ${doc.type.toUpperCase()}</p>
                <p>Date: ${date}</p>
            </div>
            <div class="document-actions">
                <button onclick="downloadDocument(${doc.id})">
                    <i class="fas fa-download"></i>
                </button>
                <button onclick="deleteDocument(${doc.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        documentList.appendChild(li);
    });
}

// Get appropriate icon for file type
function getFileTypeIcon(fileType) {
    const icons = {
        'pdf': 'fas fa-file-pdf',
        'jpg': 'fas fa-file-image',
        'jpeg': 'fas fa-file-image',
        'png': 'fas fa-file-image'
    };
    return icons[fileType.toLowerCase()] || 'fas fa-file';
}

function handleSubmit(e) {
    e.preventDefault();
    
    const user = document.getElementById('user').value;
    const reportType = document.getElementById('reportType').value;
    const reportDate = document.getElementById('reportDate').value;
    const fileInput = document.getElementById('fileInput');

    // New Fields
    const description = document.getElementById('description').value;
    const status = document.getElementById('status').value;
    const doctorName = document.getElementById('doctorName').value;
    const patientName = document.getElementById('patientName').value;
    const testResults = document.getElementById('testResults').value;
    const comments = document.getElementById('comments').value;

    if (!user || !reportType || !reportDate || !fileInput.files.length) {
        alert('Please fill in all required fields and select a file.');
        return;
    }

    const formData = new FormData();
    formData.append('action', 'createReport');
    formData.append('user_uuid', user);
    formData.append('report_type', reportType);
    formData.append('report_date', reportDate);
    formData.append('file', fileInput.files[0]);
    formData.append('description', description);
    formData.append('status', status);
    formData.append('doctor_name', doctorName);
    formData.append('patient_name', patientName);
    formData.append('test_results', testResults);
    formData.append('comments', comments);

    fetch('http://localhost/backend/routes/documents.php', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log('Backend response:', data);
        if (data.success) {
            alert('Report submitted successfully');
        } else {
            alert('Failed to submit report: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error submitting report:', error);
    });
}




async function fetchUsers() {
    try {
        const response = await fetch('http://localhost/backend/routes/user.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: 'getUsers' })
        });
        const data = await response.json();
        console.log('data', data);

        if (data.success) {
            // Extract backend user UUIDs
            const backendUserUuids = data.users.map(user => user.uuid);

            // Extract sampleDocuments user IDs (those who are patients in the sample)
            const sampleUserUuids = Object.keys(sampleDocuments);

            // Find users that are only from backend and not from sampleDocuments
            const filteredUsers = data.users.filter(user => !sampleUserUuids.includes(user.uuid));

            // Populate the user select dropdown with filtered users
            const userSelect = document.getElementById('user');
            userSelect.innerHTML = ''; // Clear existing options
            filteredUsers.forEach(user => {
                const option = document.createElement('option');
                option.value = user.uuid;
                option.textContent = user.name; // Show user name in the dropdown
                userSelect.appendChild(option);
            });
        } else {
            alert('Failed to fetch users: ' + data.message);
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}


// Document action handlers (these would typically interact with a backend)
function downloadDocument(docId) {
    console.log(`Downloading document ${docId}`);
    // Implement actual download functionality
}

function deleteDocument(docId) {
    if (confirm('Are you sure you want to delete this document?')) {
        console.log(`Deleting document ${docId}`);
        // Implement actual delete functionality
        // After deletion, refresh the document list
        loadUserDocuments();
    }
}