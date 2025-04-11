
let selectedDoctor = null;
let selectedSession = null;
async function getAllDoctors() {
    try {
        const response = await fetch('http://localhost/backend/routes/doctor.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch doctors');
        }

        const data = await response.json();
        console.log('API Response:', data); // Debugging: Check the API response format

        // Extract doctors array from response
        const doctors = data.doctors || [];

        showDoctors(doctors); // Call function to display doctors
    } catch (error) {
        console.error('Error fetching doctors:', error);
    }
}

function showDoctors(doctors) {
    const content = document.getElementById('content');

    if (!Array.isArray(doctors) || doctors.length === 0) {
        content.innerHTML = `<p>No doctors available.</p>`;
        return;
    }

    content.innerHTML = `
                <h2>Select a Doctor</h2>
                <div class="doctor-grid">
                    ${doctors.map(doctor => `
                        <div class="doctor-card" onclick="selectDoctor('${doctor.doctorID}')">
                                          <img src="${doctor.picture ? 'data:image/jpeg;base64,' + doctor.picture : './assets/img/doctor-defult.jpg'}"
                                 alt="${doctor.name}" class="doctor-image">
                            <h3>${doctor.name}</h3>
                            <p>${doctor.specialization}</p>
                        </div>
                    `).join('')}
                </div>
            `;
}

// Call function to fetch and display doctors
getAllDoctors();

async function getSessionsByDoctor(doctorId) {
    try {
        const response = await fetch(`http://localhost/backend/routes/doctorSession.php?action=getByDoctorId&doctorID=${doctorId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch sessions');
        }

        const data = await response.json();
        console.log('doctorSessions', data); // Debugging: Check the data format

        showSessions(data.sessions || []); // Pass the sessions to the showSessions function
    } catch (error) {
        console.error('Error fetching doctor sessions:', error);
    }
}


function showSessions(sessions) {
    const content = document.getElementById('content');

    if (sessions.length === 0) {
        content.innerHTML = `<p>No sessions available for this doctor.</p>`;
        return;
    }

    console.log('sessions', sessions);

    content.innerHTML = `
                <h2>Select a Session</h2>
                <div class="session-grid">
                    ${sessions.map(session => `
                        <div class="session-card" onclick="selectSession('${session.session_id}')">
                            <div class="session-header">
                                <i class="fas fa-hospital-alt"></i> <!-- Hospital Icon -->
                                <h3>${session.branch}</h3>
                            </div>
                            <div class="session-info">
                                <div class="info-item">
                                    <i class="fas fa-clock"></i> <!-- Time Icon -->
                                    <p><strong>Time:</strong> ${session.start_time} - ${session.end_time}</p>
                                </div>
                                <div class="info-item">
                                    <i class="fas fa-calendar-alt"></i> <!-- Calendar Icon -->
                                    <p><strong>Date:</strong> ${session.date}</p>
                                </div>
                            </div>
                            <div class="session-footer">
                                <button class="select-button">Select Session</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
}




function showAppointmentForm() {
    const content = document.getElementById('content');
    content.innerHTML = `
                <h2>Patient Details</h2>
                <form onsubmit="submitAppointment(event)" class="appointment-form">
                    <div class="form-group">
                        <label for="name">Full Name</label>
                        <input type="text" id="name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" required>
                    </div>
                    <div class="form-group">
                        <label for="phone">Phone Number</label>
                        <input type="tel" id="phone" required>
                    </div>
                    <button type="submit" class="btn">Proceed to Payment</button>
                </form>
            `;
}

async function submitAppointment(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const userID = sessionStorage.getItem('userUUID');  // Replace with actual userID

    const appointmentData = {
        name: name,
        email: email,
        phone: phone,
        session_id: selectedSession,
        userID: userID
    };

    console.log('appointmentData', appointmentData);

    // Proceed to payment after capturing patient details
    showPayment(appointmentData);
}


function showPayment(appointmentData) {
    const content = document.getElementById('content');
    content.innerHTML = `
                <div class="payment-section">
                    <h2>Payment Details</h2>
                    <div class="form-group">
                        <label for="card">Card Number</label>
                        <input type="text" id="card" placeholder="1234 5678 9012 3456" required>
                    </div>
                    <div class="form-group">
                        <label for="expiry">Expiry Date</label>
                        <input type="text" id="expiry" placeholder="MM/YY" required>
                    </div>
                    <div class="form-group">
                        <label for="cvv">CVV</label>
                        <input type="text" id="cvv" placeholder="123" required>
                    </div>
                    <button id="confirmBookingButton" class="btn">Confirm Booking</button>
                </div>
            `;

    // Add event listener for the confirm booking button
    document.getElementById('confirmBookingButton').addEventListener('click', function () {
        confirmBooking(appointmentData);
    });
}
function selectDoctor(doctorId) {
    selectedDoctor = doctorId;
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    document.getElementById('step2').classList.add('active');
    getSessionsByDoctor(doctorId)
}

function selectSession(sessionId) {
    selectedSession = sessionId;
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    document.getElementById('step3').classList.add('active');
    showAppointmentForm();
}

async function confirmBooking(appointmentData) {
    // Show the loading spinner
    showLoadingSpinner();

    // Hide the payment form
    document.querySelector('.payment-section').style.display = 'none';

    console.log('appointmentData', appointmentData);
    try {
        const response = await fetch('http://localhost/backend/routes/appointment.php?route=create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(appointmentData)
        });

        // Directly parse the response as JSON
        const result = await response.json(); // Only parse JSON directly

        console.log('Response:', result); // Log the parsed JSON response

        if (result.success) {
            hideLoadingSpinner();
            showSuccessModal();
        } else {
            alert('Failed to create appointment');
            hideLoadingSpinner();
            showPayment(appointmentData);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during booking');
        hideLoadingSpinner();
        showPayment(appointmentData);
    }
}




function showLoadingSpinner() {
    const content = document.getElementById('content');
    content.innerHTML += `
                <div class="loading-overlay">
                    <div class="spinner"></div>
                    <p>Processing Payment...</p>
                </div>
            `;
}

function hideLoadingSpinner() {
    const spinner = document.querySelector('.loading-overlay');
    if (spinner) {
        spinner.style.display = 'none';
    }
}

function showSuccessModal() {
    const content = document.getElementById('content');
    content.innerHTML += `
                <div class="success-modal">
                    <div class="modal-content">
                        <h3>Payment Successful</h3>
                        <p>Your payment was successfully processed. Thank you for choosing our service!</p>
                        <button onclick="closeSuccessModal()">Close</button>
                    </div>
                </div>
            `;
}

function closeSuccessModal() {
    const modal = document.querySelector('.success-modal');
    if (modal) {
        modal.style.display = 'none';
    }

    // Optionally, you can show the payment form again here:
    document.querySelector('.payment-section').style.display = 'block';
}

// Initialize the page
showDoctors();