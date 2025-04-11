// Fetch doctors from the backend and populate the dropdown
fetch('http://localhost/backend/routes/doctor.php')
  .then(response => response.json())
  .then(data => {
    const doctors = data.doctors;
    const doctorDropdown = document.getElementById('doctor');
    doctorDropdown.innerHTML = '<option value="">Select a doctor</option>';
    
    doctors.forEach(doctor => {
      const option = document.createElement('option');
      option.value = doctor.doctorID;
      option.textContent = doctor.name;
      doctorDropdown.appendChild(option);
    });
  })
  .catch(error => {
    console.error('Error fetching doctors:', error);
  });

  function getAllSessions() {
    // First, fetch all sessions
    fetch('http://localhost/backend/routes/doctorSession.php?action=get')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // Parse JSON response
      })
      .then(data => {
        if (data.status === 'success') {
          const sessionsTable = document.getElementById('sessions-table').getElementsByTagName('tbody')[0];
          sessionsTable.innerHTML = ''; // Clear previous sessions
  
          // Fetch doctors' information
          fetch('http://localhost/backend/routes/doctor.php')  // This is assuming doctor.php returns a list of doctors
            .then(response => response.json())
            .then(doctorData => {
              const doctors = doctorData.doctors;
              // Map doctor ID to doctor name for quick lookup
              const doctorMap = doctors.reduce((map, doctor) => {
                map[doctor.doctorID] = doctor.name;
                return map;
              }, {});
  
              // Loop through each session and populate the table
              data.sessions.forEach(session => {
                const row = document.createElement('tr');
                row.setAttribute('data-session-id', session.session_id);  // Add the data-session-id attribute here
                row.innerHTML = `
                  <td>${doctorMap[session.doctor_id] || 'Unknown'}</td>
                  <td>${session.branch}</td>
                  <td>${session.date}</td>
                  <td>${session.start_time}</td>
                  <td>${session.end_time}</td>
                  <td>
                    <button class="btn btn-warning" onclick="editSession('${session.session_id}')">Edit</button>
                    <button class="btn btn-danger" onclick="deleteSession('${session.session_id}')">Delete</button>
                  </td>
                `;
                sessionsTable.appendChild(row);
              });
            })
            .catch(error => {
              console.error('Error fetching doctors:', error);
            });
        } else {
          console.error('Error fetching sessions:', data.message);
        }
      })
      .catch(error => {
        console.error('Error fetching sessions:', error);
      });
  }
  
  
  

// Create new session
document.getElementById('submit').addEventListener('click', function () {
  const doctorId = document.getElementById('doctor').value;
  const branch = document.getElementById('branch').value;
  const date = document.getElementById('date').value;
  const startTime = document.getElementById('start-time').value;
  const endTime = document.getElementById('end-time').value;

  if (!doctorId || !branch || !date || !startTime || !endTime) {
    alert('Please fill in all fields');
  } else {
    const data = {
      doctorId: doctorId,
      branch: branch,
      date: date,
      startTime: startTime,
      endTime: endTime
    };

    fetch('http://localhost/backend/routes/doctorSession.php?action=create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      showNotification(data.status, data.message);
      if (data.status === 'success') {
        getAllSessions(); // Reload sessions
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      showNotification('error', 'Error booking appointment');
    });
  }
});

// Edit an existing session
function editSession(sessionId) {
  const sessionRow = document.querySelector(`tr[data-session-id="${sessionId}"]`);
  if (!sessionRow) {
    console.error(`Session with ID ${sessionId} not found.`);
    return;
  }

  const doctorName = sessionRow.querySelector('td:nth-child(1)').textContent;
  const branch = sessionRow.querySelector('td:nth-child(2)').textContent;
  const date = sessionRow.querySelector('td:nth-child(3)').textContent;
  const startTime = sessionRow.querySelector('td:nth-child(4)').textContent;
  const endTime = sessionRow.querySelector('td:nth-child(5)').textContent;

  console.log('doctorName', doctorName);

  // Set doctor name in the dropdown
  const doctorDropdown = document.getElementById('doctor');
  Array.from(doctorDropdown.options).forEach(option => {
    if (option.textContent.trim() === doctorName.trim()) {
      option.selected = true;
    }
  });

  // Populate other fields
  document.getElementById('branch').value = branch;
  document.getElementById('date').value = date;
  document.getElementById('start-time').value = startTime;
  document.getElementById('end-time').value = endTime;
  document.getElementById('session-id').value = sessionId;

  // Show update button and hide submit button
  document.getElementById('update').style.display = 'inline';
  document.getElementById('submit').style.display = 'none';
}

  

document.getElementById('update').addEventListener('click', function () {
  const sessionId = document.getElementById('session-id').value;
  const doctorId = document.getElementById('doctor').value;
  const branch = document.getElementById('branch').value;
  const date = document.getElementById('date').value;
  const startTime = document.getElementById('start-time').value;
  const endTime = document.getElementById('end-time').value;

  const data = {
    doctorId: doctorId,
    branch: branch,
    date: date,
    startTime: startTime,
    endTime: endTime
  };

  fetch(`http://localhost/backend/routes/doctorSession.php?action=update&session_id=${sessionId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    showNotification(data.status, data.message);
    if (data.status === 'success') {
      getAllSessions(); // Reload sessions
    }
  })
  .catch(error => console.error('Error updating session:', error));
});

// Delete session
function deleteSession(sessionId) {
  fetch(`http://localhost/backend/routes/doctorSession.php?action=delete&session_id=${sessionId}`, {
    method: 'DELETE'
  })
  .then(response => response.json())
  .then(data => {
    showNotification(data.status, data.message);
    if (data.status === 'success') {
      getAllSessions(); // Reload sessions
    }
  })
  .catch(error => console.error('Error deleting session:', error));
}

// Function to display success/error notifications
function showNotification(type, message) {
  const notification = document.getElementById('notification');
  notification.classList.add(type);
  notification.textContent = message;
  notification.style.display = 'block';
  setTimeout(() => {
    notification.style.display = 'none';
    notification.classList.remove(type);
  }, 3000);
}
  
// Initial fetch of all sessions when the page loads
getAllSessions();
