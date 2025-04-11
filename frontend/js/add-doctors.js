document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('doctorForm');
    const doctorListTable = document.getElementById('doctorListBody');
    const responseMessage = document.getElementById('responseMessage');
    let currentDoctorId = null;

    // Load the doctor list from the API
    loadDoctorList();

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
    
        const formData = new FormData();
        formData.append('doctorID', currentDoctorId);
        formData.append('doctorName', document.getElementById('doctorName').value);
        formData.append('doctorEmail', document.getElementById('doctorEmail').value);
        formData.append('specialization', document.getElementById('specialization').value);
        formData.append('phone', document.getElementById('phone').value);
        formData.append('status', document.getElementById('status').value);
    
        const pictureInput = document.getElementById('doctorPicture');
        if (pictureInput.files.length > 0) {
            const base64Picture = await convertToBase64(pictureInput.files[0]);
            formData.append('picture', base64Picture);
        }
    
        let requestUrl = 'http://localhost/backend/routes/doctor.php';
        let method = 'POST';
    
        if (currentDoctorId) {
            requestUrl = `http://localhost/backend/routes/doctor.php?doctorID=${currentDoctorId}`;
            method = 'POST'; // Using POST because PUT does not support FormData in some cases
        }
    
        try {
            const response = await fetch(requestUrl, {
                method: method,
                body: formData
            });
    
            const textResponse = await response.text(); // Debugging
            console.log('Server Response:', textResponse);
    
            const data = JSON.parse(textResponse);
            if (data.success) {
                responseMessage.textContent = data.message;
                responseMessage.style.backgroundColor = "#dff0d8";
                responseMessage.style.color = "#3c763d";
                loadDoctorList();
                resetForm();
            } else {
                responseMessage.textContent = data.message;
                responseMessage.style.backgroundColor = "#f2dede";
                responseMessage.style.color = "#a94442";
            }
        } catch (error) {
            console.error('Error:', error);
            responseMessage.textContent = 'An error occurred. Please try again later.';
            responseMessage.style.backgroundColor = "#f2dede";
            responseMessage.style.color = "#a94442";
        }
    });
    
    

    // Convert file to Base64
    function convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]); // Remove "data:image/..." prefix
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    }
    function editDoctor(doctorId) {
        console.log('Edit button clicked for ID:', doctorId);
        fetch(`http://localhost/backend/routes/doctor.php?doctorID=${doctorId}`)
            .then(response => response.json())
            .then(data => {
                console.log('Fetched doctor data:', data);
                if (data.doctor) {  // Check for the existence of the doctor
                    const doctor = data.doctor;
                    document.getElementById('doctorName').value = doctor.name;
                    document.getElementById('doctorEmail').value = doctor.email;
                    document.getElementById('specialization').value = doctor.specialization;
                    document.getElementById('phone').value = doctor.phone;
                    document.getElementById('status').value = doctor.status;
                    currentDoctorId = doctor.doctorID;
                    document.getElementById('formTitle').textContent = 'Edit Doctor';
                    console.log('Form updated successfully!');
                } else {
                    console.error('Error: Doctor data is missing.');
                }
            })
            .catch(error => console.error('Error fetching doctor:', error));
    }
       
    
    // Delete doctor functionality
    function deleteDoctor(doctorId) {
        const confirmDelete = confirm('Are you sure you want to delete this doctor?');
        console.log('doctorId',doctorId)
        if (confirmDelete) {
            fetch(`http://localhost/backend/routes/doctor.php`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ doctorID: doctorId })
            })           
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    loadDoctorList(); // Refresh the doctor list
                    responseMessage.textContent = data.message;
                    responseMessage.style.backgroundColor = "#dff0d8";
                    responseMessage.style.color = "#3c763d";
                } else {
                    responseMessage.textContent = data.message;
                    responseMessage.style.backgroundColor = "#f2dede";
                    responseMessage.style.color = "#a94442";
                }
            })
            .catch(error => {
                console.error('Error:', error);
                responseMessage.textContent = 'An error occurred while deleting. Please try again later.';
                responseMessage.style.backgroundColor = "#f2dede";
                responseMessage.style.color = "#a94442";
            });
        }
    }

    // Load doctors list from the server
    function loadDoctorList() {
        fetch('http://localhost/backend/routes/doctor.php')
            .then(response => response.json())
            .then(data => {
                doctorListTable.innerHTML = '';
                if (data.doctors && data.doctors.length > 0) {
                    data.doctors.forEach(doctor => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${doctor.name}</td>
                            <td>${doctor.email}</td>
                            <td>${doctor.specialization}</td>
                            <td>${doctor.status}</td>
                            <td>
                                <button class="edit-btn" data-id="${doctor.doctorID}">Edit</button>
                                <button class="delete-btn" data-id="${doctor.doctorID}">Delete</button>
                            </td>
                        `;
                        doctorListTable.appendChild(row);
                    });
                }
            })
            .then(() => {
                // Attach event listeners to edit and delete buttons
                document.querySelectorAll('.edit-btn').forEach(button => {
                    button.addEventListener('click', function () {
                        editDoctor(this.getAttribute('data-id'));
                    });
                });
    
                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', function () {
                        deleteDoctor(this.getAttribute('data-id'));
                    });
                });
            });
    }
    

    // Reset the form
    function resetForm() {
        form.reset();
        currentDoctorId = null;
        document.getElementById('formTitle').textContent = 'Add New Doctor';
    }
});
