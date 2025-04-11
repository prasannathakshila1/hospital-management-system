// Get the userRole from sessionStorage
const userID = sessionStorage.getItem("userRole");

// Check if the userRole is 'admin'
if (userID === "admin") {
    // Show the admin panel link
    document.getElementById("admin-link").style.display = "block";
} else {
    // Ensure the admin panel link is hidden for non-admin users
    document.getElementById("admin-link").style.display = "none";
}
function showBooking() {
    alert("Booking system will be integrated here!");
}

// Animate services on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
        }
    });
});
function signOut(){
    sessionStorage.clear();
    window.location.href = "../login.html";
}
document.querySelectorAll('.service-card').forEach(card => {
    card.style.opacity = 0;
    card.style.transform = 'translateY(50px)';
    card.style.transition = 'all 0.6s ease-out';
    observer.observe(card);
});