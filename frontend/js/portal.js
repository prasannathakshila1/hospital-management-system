// Sample data structure
let appointments = [];
let sessionID;

// Function to get session details by sessionID
function getSessionByID(sessionID) {
    console.log("work....")
    console.log('sessionID', sessionID);

    const endpoint = `http://localhost/backend/routes/doctorSession.php?action=getBySessionId&session_id=${sessionID}`;

    fetch(endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            console.log('Session Data:', data.session);
            if (data.session) {
                const doctorID = data.session.doctor_id;
                const sessionData = data.session;
                getDoctorBySession(doctorID, sessionData);
            } else {
                console.error('No session data available');
            }
        } else {
            console.error('Failed to fetch session:', data.message);
        }
    })
    .catch(error => {
        console.error('Error fetching session:', error);
    });
}

function getDoctorBySession(doctorID, session) {
    console.log('doctorID', doctorID);
    fetch(`http://localhost/backend/routes/doctor.php?doctorID=${doctorID}`, {
        method: 'GET',  // HTTP method
        headers: {
            'Content-Type': 'application/json', // Set the content type to JSON
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Doctor not found');
        }
        return response.json(); // Parse the JSON response
    })
    .then(data => {
        console.log('Doctor data:', data); // Handle the doctor data here
        if (data.success === false) {
            console.log('Error:', data.message);  // Log any error message returned from the server
        } else {
            const appointment = {
                session_id: session.session_id,  // Use session data passed from getSessionByID
                doctor_id: doctorID,
                doctor: {
                    name: data.doctor.name,  // Access the doctor data from the response
                    specialization: data.doctor.specialization,
                    picture: `${data.doctor.picture ? 'data:image/jpeg;base64,' + data.doctor.picture : './assets/img/doctor-defult.jpg'}`,
                    status: data.doctor.status || 'Active',  // Default status if not provided
                },
                branch: session.branch,
                date: session.date,
                start_time: session.start_time,
                end_time: session.end_time,
            };
            // Push this appointment into appointmentsData array
            appointments.push(appointment);
            displayAppointments(appointments);  // Update the display with all appointments
        }
    })
    .catch(error => {
        console.error('Error fetching doctor:', error);
        // Handle any errors, like doctor not found or server issues
    });
}




function getAppointmnetUser() {
    const userID = sessionStorage.getItem('userUUID');
    if (!userID) {
        console.error('User ID not found in sessionStorage');
        return;
    }

    const endpoint = `http://localhost/backend/routes/appointment.php?route=list&userID=${userID}`;

    fetch(endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Appointments:', data.appointments);

            if (data.appointments && data.appointments.length > 0) {
                // Filter the appointments based on userID if needed
                const userAppointments = data.appointments.filter(appointment => appointment.userID === userID);
                
                // Now loop through the filtered appointments and process each one
                userAppointments.forEach(appointment => {
                    sessionID = appointment.session_id;
                    getSessionByID(sessionID);
                });
            }
        } else {
            console.error('Failed to fetch appointments:', data.message);
        }
    })
    .catch(error => {
        console.error('Error fetching appointments:', error);
    });
}


function displayAppointments(appointments) {
    const appointmentList = document.getElementById('appointmentsList');
    if (appointmentList) {
        appointmentList.innerHTML = ''; // Clear the list before adding new appointments
        appointments.forEach(appointment => {
            appointmentList.innerHTML += createAppointmentCard(appointment);
        });
    }
}


// Call the getAppointmnetUser function to start the process
getAppointmnetUser();
        
        function createAppointmentCard(appointment) {
            console.log('appointment',appointment)
            return `
                <div class="appointment-card" data-session-id="${appointment.session_id}">
                    <img src="${appointment.doctor.picture}" alt="${appointment.doctor.name}" class="doctor-avatar">
                    <div class="appointment-details">
                        <h3>${appointment.doctor.name}</h3>
                        <p>${appointment.doctor.specialization}</p>
                        <p><i class="fas fa-hospital"></i> ${appointment.branch}</p>
                        <p><i class="fas fa-calendar"></i> ${appointment.date}</p>
                        <p><i class="fas fa-clock"></i> ${appointment.start_time} - ${appointment.end_time}</p>
                        <span class="status-badge status-upcoming">Upcoming</span>
                    </div>
                    <div class="appointment-actions">
                        <button class="btn btn-view" onclick="viewAppointment('${appointment.session_id}')">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button class="btn btn-cancel" onclick="cancelAppointment('${appointment.session_id}')">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    </div>
                </div>
            `;
        }

        function viewAppointment(sessionId) {
            const appointment = appointments.find(a => a.session_id === sessionId);
            if (appointment) {
                // Populate modal with appointment details
                document.getElementById('modalDoctorImage').src = appointment.doctor.picture;
                document.getElementById('modalDoctorName').textContent = appointment.doctor.name;
                document.getElementById('modalDoctorSpecialization').textContent = appointment.doctor.specialization;
                document.getElementById('modalSessionId').textContent = appointment.session_id;
                document.getElementById('modalBranch').textContent = appointment.branch;
                document.getElementById('modalDate').textContent = appointment.date;
                document.getElementById('modalTime').textContent = `${appointment.start_time} - ${appointment.end_time}`;
                document.getElementById('modalDoctorId').textContent = appointment.doctor_id;
                document.getElementById('modalDoctorStatus').textContent = appointment.doctor.status;

                // Show modal with animation
                const modal = document.getElementById('appointmentModal');
                modal.classList.add('show');
            }
        }

        function closeModal() {
            const modal = document.getElementById('appointmentModal');
            modal.classList.remove('show');
        }

        function editAppointment(sessionId) {
            alert(`Editing appointment ${sessionId}`);
        }

        function cancelAppointment(sessionId) {
            if (confirm('Are you sure you want to cancel this appointment?')) {
                const appointmentCard = document.querySelector(`[data-session-id="${sessionId}"]`);
                if (appointmentCard) {
                    appointmentCard.style.animation = 'slideUp 0.5s ease reverse';
                    setTimeout(() => {
                        appointmentCard.remove();
                    }, 500);
                }
            }
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
                console.log('User data:', data.user); // Log the complete user data
        
                // Check if the response is successful
                if (data.success) {
                    // Update the HTML elements with the patient data
                    document.getElementById('patientName').textContent = data.user.name || 'Not Available';
                    document.getElementById('patientEmail').textContent = data.user.email || 'Not Available';
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
        
        // Get the UUID from sessionStorage
        const userID = sessionStorage.getItem('userUUID');
        
        // Example usage: Call the function with the UUID from sessionStorage
        fetchPatientDetails(userID);

        // Close modal when clicking outside
        window.onclick = function(event) {
            const modal = document.getElementById('appointmentModal');
            if (event.target === modal) {
                closeModal();
            }
        }

        // Initialize appointments
        document.addEventListener('DOMContentLoaded', () => {
            const appointmentsList = document.getElementById('appointmentsList');
            appointments.forEach(appointment => {
                appointmentsList.innerHTML += createAppointmentCard(appointment);
            });
        });