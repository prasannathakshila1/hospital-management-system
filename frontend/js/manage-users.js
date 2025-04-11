document.addEventListener('DOMContentLoaded', () => {
    // Fetch user data from the backend
    fetchUsers();

    // Function to fetch and display users
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
                // Populate the user table
                const tableBody = document.querySelector('#user-table tbody');
                tableBody.innerHTML = ''; // Clear existing data

                data.users.forEach(user => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${user.uuid}</td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.role}</td>
                        <td>
                            <button class="edit-btn" data-id="${user.uuid}"> <i class="fas fa-edit"></i>Edit</button>
                            <button class="delete-btn" data-id="${user.uuid}"> <i class="fas fa-trash-alt"></i>Delete</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });

                // Attach event listeners for edit and delete buttons
                attachEventListeners();
            } else {
                alert('Failed to fetch users: ' + data.message);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    // Attach event listeners to the dynamically generated buttons
    function attachEventListeners() {
        const editButtons = document.querySelectorAll('.edit-btn');
        const deleteButtons = document.querySelectorAll('.delete-btn');

        editButtons.forEach(button => {
            button.addEventListener('click', handleEdit);
        });

        deleteButtons.forEach(button => {
            button.addEventListener('click', handleDelete);
        });
    }
// Handle edit button click
function handleEdit(event) {
    const userId = event.target.dataset.id; // Get userId from the button's data-id attribute
    console.log('userId:', userId); // Check the value of userId for debugging

    // Fetch the user data for editing
    fetch(`http://localhost/backend/routes/user.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'getUsers', uuid: userId }) // Correct action to 'getUser'
    })
        .then(response => response.json())
        .then(data => {
            console.log('Fetched data:', data); // Log the entire response for debugging

            if (data.success) {
                // Find the user with the matching uuid
                const user = data.users.find(user => user.uuid === userId);
                
                if (user) {
                    // Populate the form with the user's details
                    document.getElementById('edit-user-id').value = user.uuid;
                    document.getElementById('edit-user-name').value = user.name;
                    document.getElementById('edit-user-email').value = user.email;
                    document.getElementById('edit-user-role').value = user.role;

                    // Show the modal
                    document.getElementById('edit-user-modal').style.display = 'block';
                } else {
                    alert('User not found');
                }
            } else {
                alert('Failed to fetch user details: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error fetching user details:', error);
        });
}




// Handle form submission for editing user
document.getElementById('edit-user-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const userId = document.getElementById('edit-user-id').value;
    console.log('userId', userId);

    const updatedData = {
        uuid: userId,
        name: document.getElementById('edit-user-name').value,
        email: document.getElementById('edit-user-email').value,
        role: document.getElementById('edit-user-role').value,
    };

    try {
        const response = await fetch('http://localhost/backend/routes/user.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'update', ...updatedData }),
        });

        // Check if the response is valid JSON
        const data = await response.json();

        if (response.ok && data.success) {
            alert('User updated successfully!');
            fetchUsers(); // Refresh the user list
            document.getElementById('edit-user-modal').style.display = 'none'; // Close the modal
        } else {
            // Handle the case where the API returned an error message
            alert('Failed to update user: ' + (data.message || 'Unknown error'));
        }
    } catch (error) {
        // Handle network errors or invalid responses
        console.error('Error updating user:', error);
        alert('An error occurred while updating the user. Please try again later.');
    }
});


    // Handle cancel button click
    document.getElementById('cancel-edit').addEventListener('click', () => {
        document.getElementById('edit-user-modal').style.display = 'none';
    });

    // Handle delete button click
    async function handleDelete(event) {
        const userId = event.target.dataset.id;
        const confirmDelete = confirm('Are you sure you want to delete this user?');

        if (confirmDelete) {
            try {
                const response = await fetch('http://localhost/backend/routes/user.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ action: 'delete', uuid: userId })
                });
                const data = await response.json();

                if (data.success) {
                    alert('User deleted successfully!');
                    fetchUsers(); // Refresh the user list
                } else {
                    alert('Failed to delete user: ' + data.message);
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    }
});
