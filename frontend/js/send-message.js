let chatVisible = false;
const chatDialog = document.querySelector('.chat-dialog');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const typingIndicator = document.getElementById('typingIndicator');
let awaitingReportDetails = false;

// Predefined responses
const responses = {
    'hey': [
        "Hey! How can I help you today?",
        "Welcome! What brings you to Care Compass Hospitals today?",
        "Hello! I'm here to assist you with any questions about our services."
    ],
    'appointment': [
        "I can help you book an appointment. Please specify your preferred department:",
        "1. General Medicine\n2. Cardiology\n3. Orthopedics\n4. Pediatrics\n5. Dental",
        "Would you like me to help you schedule an appointment with one of our specialists?",
        "Click here to book your appointment: <a href='appointment.html' target='_blank'>Book Appointment</a>"  // Ensure HTML link is inside the string
    ],
    'hours': [
        "Our hospital is open 24/7 for emergencies.",
        "Regular consultation hours are:\nMonday-Friday: 9:00 AM - 6:00 PM\nSaturday: 9:00 AM - 2:00 PM\nSunday: Closed for regular consultations"
    ],
    'help': [
        "I'm here to assist you! You can ask about appointment bookings, hospital hours, or report any issues.",
        "Feel free to ask me anything about our hospital services or report any concerns you have."
    ],
    'location': [
        "Care Compass Hospitals has branches in Kandy, Colombo, and Kurunegala. Would you like directions to any of these locations?",
        "You can visit our hospital branches at:\n1. Kandy\n2. Colombo\n3. Kurunegala. Let me know which one you'd like more information about!"
    ],
    'emergency': [
        "In case of an emergency, please call our emergency number: 123-456-7890.",
        "For emergencies, our hospital is available 24/7. Please proceed to the nearest ER."
    ],
    'thank you': [
        "You're welcome! If you need further assistance, feel free to ask.",
        "Glad I could help! Let me know if you need anything else."
    ],
    'services': [
        "We offer a variety of services at Care Compass Hospitals, including:\n1. General Medicine\n2. Cardiology\n3. Orthopedics\n4. Pediatrics\n5. Dental Care\n6. Medical Tests & Lab Services",
        "Care Compass Hospitals provides a wide range of services such as appointment scheduling, medical treatment, and access to your medical records online. How can I assist you with our services today?"
    ],
    'register': [
        "To register for medical services, please visit our registration page on the website. I can assist you with the steps if needed.",
        "You can easily register for medical services by filling out the registration form on our website. Would you like the link to the registration page?"
    ],
    'doctor': [
        "Our doctors are highly qualified and specialize in various fields. You can view detailed profiles of our doctors, including their specialties and qualifications on our website.",
        "We have a list of doctors with their specialties and qualifications. Would you like me to provide more details on a specific doctor?"
    ],
    'lab results': [
        "You can access your lab results through your patient account on our website. If you need help finding them, I can guide you.",
        "Lab results can be accessed via your patient portal on our website. Do you need help with this?"
    ],
    'medical test': [
        "Our hospital offers a variety of medical tests and lab services. Would you like more information on the specific tests we offer?",
        "We provide several medical tests, including blood tests, X-rays, and more. You can find detailed information on our website."
    ],
    'query': [
        "You can submit your queries regarding medical services and tests through the website's query form. Let me know if you'd like assistance with this.",
        "Feel free to submit any questions or concerns you may have, and our team will get back to you. Would you like to proceed with submitting a query?"
    ],
    'feedback': [
        "We value your feedback! Please share your thoughts or suggestions with us.",
        "Your feedback helps us improve our services. What can we do better?",
        "Thank you for your feedback! We strive to provide the best service possible."
    ],
    'payment': [
        "For payment information, please visit our billing page. I can help you with the steps if needed.",
        "You can check your payment status or make a payment through our online portal. Let me know if you need assistance.",
        "If you have questions about your bill or payment, please feel free to ask."
    ],
    'insurance': [
        "Care Compass Hospitals accepts several types of insurance. Would you like to know if we accept your insurance provider?",
        "We can assist you with insurance-related inquiries. Please let me know if you need help with your coverage."
    ],
    'health tips': [
        "Here are some health tips to keep in mind:\n1. Stay hydrated\n2. Eat a balanced diet\n3. Exercise regularly",
        "Remember to prioritize your health. Take breaks, stay active, and eat well for a happy, healthy life!"
    ],
    'careers': [
        "We are always looking for talented individuals to join our team. Would you like to know about open positions?",
        "Interested in working with us? Visit our careers page to see job openings or inquire about available positions."
    ],
    'news': [
        "Stay updated with the latest news from Care Compass Hospitals! We have new services and promotions coming soon.",
        "Did you know? We're expanding our services to include new specialties. Stay tuned for more updates!"
    ],
    'newsletter': [
        "Would you like to subscribe to our newsletter for updates on health tips, promotions, and news?",
        "Sign up for our newsletter to receive the latest news, health tips, and special offers right in your inbox."
    ],
    'faq': [
        "For frequently asked questions, please visit our FAQ page. Let me know if you need more help with anything.",
        "Have questions? Check our FAQ section or ask me directly, and I'll assist you!"
    ],
    'contact': [
        "You can contact us directly at our helpline: 123-456-7890 or send an email to info@carecompass.com.",
        "For any inquiries, feel free to reach out to us at info@carecompass.com or call 123-456-7890."
    ],
'developer': [
    "Care Compass web was developed by Thakshila Prasanna, an Associate Software Engineer. At just 20 years old, he is one of the youngest software engineers in Sri Lanka.<br><img src='assets/img/aiThakshila.jpeg' alt='Thakshila Prasanna' style='width:150px; height:auto; border-radius:10px; margin-top:10px;'>"
],
'develop': [
    "Care Compass web was developed by Thakshila Prasanna, an Associate Software Engineer. At just 20 years old, he is one of the youngest software engineers in Sri Lanka.<br><img src='assets/img/aiThakshila.jpeg' alt='Thakshila Prasanna' style='width:150px; height:auto; border-radius:10px; margin-top:10px;'>"
],


};

// Show typing indicator
function showTypingIndicator() {
    typingIndicator.style.display = 'block';
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    typingIndicator.style.display = 'none';
}

// Type effect for bot messages
function typeMessage(element, text, index = 0) {
    if (index < text.length) {
        element.textContent += text.charAt(index);
        setTimeout(() => typeMessage(element, text, index + 1), 20);
    }
}

// Add a bot message with typing effect
// Add a bot message with typing effect and TTS
function addBotMessage(text) {
    showTypingIndicator();
    
    setTimeout(() => {
        hideTypingIndicator();

        const message = document.createElement('div');
        message.className = 'message bot-message';
        chatMessages.appendChild(message);
        
        // Use innerHTML to allow HTML tags like <a> to be rendered correctly
        message.innerHTML = text;  // This will render HTML tags (like <a>) properly

        // TTS: Speak the message
        speakMessage(text);

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
}

// Function to handle text-to-speech
function speakMessage(text) {
    // Check if SpeechSynthesis is supported
    if ('speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = 'en-US'; // You can change the language here, e.g., 'en-GB' for British English

        // Optionally set additional properties for voice and pitch
        speech.pitch = 1; // Default pitch
        speech.rate = 1;  // Default speed rate

        // Speak the message
        window.speechSynthesis.speak(speech);
    } else {
        console.error('Text-to-speech is not supported in this browser.');
    }
}


// Add a user message
function addUserMessage(text) {
    const message = document.createElement('div');
    message.className = 'message user-message';
    message.textContent = text;
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleQuickReply(type) {
    const userId = sessionStorage.getItem('userUUID'); // Replace with the actual user ID
    const date = new Date().toISOString(); // Get the current date and time

    switch (type.toLowerCase()) {
        case 'hey':
            addUserMessage('Hey');
            addBotMessage(responses.hey[Math.floor(Math.random() * responses.hey.length)]);
            break;
        case 'appointment':
            addUserMessage('I need to book an appointment');
            responses.appointment.forEach((response, index) => {
                setTimeout(() => addBotMessage(response), (index + 1) * 2000);
            });
            break;
        case 'hours':
            addUserMessage('What are your working hours?');
            responses.hours.forEach((response, index) => {
                setTimeout(() => addBotMessage(response), (index + 1) * 2000);
            });
            break;
        case 'report problem':
            addUserMessage('I need to report a problem');
            
            // Show the initial response message
            addBotMessage("I understand you want to report a problem. Could you please provide more details?");
            
            // We do not call sendMessageToDatabase for the quick reply 'Report Problem'
            break;
    }
}


function sendMessageToDatabase(message, userId, date, callback) {
    fetch(`http://localhost/backend/routes/reports.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, userId, date })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }
        return response.json(); // Directly parse JSON
    })
    .then(data => {
        console.log('Message saved successfully:', data);
        
        if (data.message === "Report saved successfully" && callback) {
            callback(); // Execute the callback function after success
        }
    })
    .catch(error => {
        console.error('Error saving message:', error);
    });
}

// Toggle chat visibility
function toggleChat() {
    chatVisible = !chatVisible;
    chatDialog.style.display = chatVisible ? 'flex' : 'none';
    if (chatVisible && chatMessages.children.length === 0) {
        addBotMessage("Welcome to our hospital support! How can I assist you today?");
    }
}

// Function to handle sending message from user
async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    addUserMessage(message); // Display user message in chat
    chatInput.value = ''; // Clear input field

    const lowerMessage = message.toLowerCase();
    const userId = sessionStorage.getItem('userUUID'); // Get user ID
    const date = new Date().toISOString(); // Current timestamp

    // If waiting for report details, store the message and reset the flag
    if (awaitingReportDetails) {
        sendMessageToDatabase(message, userId, date, () => {
            setTimeout(() => addBotMessage("I'll make sure your issue is recorded and addressed by our team."), 2000);
            setTimeout(() => addBotMessage("Thank you for bringing this to our attention. Our patient care team will review this shortly."), 4000);
        });
        awaitingReportDetails = false; // Reset flag after saving details
    } 
    // If the message contains report-related keywords, ask for further details
    else if (lowerMessage.includes('report') || lowerMessage.includes('urgent') || 
             lowerMessage.includes('problem') || lowerMessage.includes('issue')) {
        addBotMessage("I understand you want to report a problem. Could you please provide more details?");
        awaitingReportDetails = true; // Set flag to indicate we're waiting for report details
    } 
    // Handle other types of user inquiries
    else {
        handleGeneralResponses(lowerMessage);
    }
}

// Function to handle other types of user inquiries
function handleGeneralResponses(lowerMessage) {
    if (lowerMessage.includes('appointment')) {
        responses.appointment.forEach((response, index) => {
            setTimeout(() => addBotMessage(response), (index + 1) * 2000);
        });
    } else if (lowerMessage.includes('hours') || lowerMessage.includes('timing')) {
        responses.hours.forEach((response, index) => {
            setTimeout(() => addBotMessage(response), (index + 1) * 2000);
        });
    } else if (lowerMessage.includes('help')) {
        responses.help.forEach((response, index) => {
            setTimeout(() => addBotMessage(response), (index + 1) * 2000);
        });
    } else if (lowerMessage.includes('location')) {
        responses.location.forEach((response, index) => {
            setTimeout(() => addBotMessage(response), (index + 1) * 2000);
        });
    } else if (lowerMessage.includes('emergency')) {
        responses.emergency.forEach((response, index) => {
            setTimeout(() => addBotMessage(response), (index + 1) * 2000);
        });
    } else if (lowerMessage.includes('thank you')) {
        responses['thank you'].forEach((response, index) => {
            setTimeout(() => addBotMessage(response), (index + 1) * 2000);
        });
    } else if (lowerMessage.includes('services')) {
        responses.services.forEach((response, index) => {
            setTimeout(() => addBotMessage(response), (index + 1) * 2000);
        });
    } else if (lowerMessage.includes('register')) {
        responses.register.forEach((response, index) => {
            setTimeout(() => addBotMessage(response), (index + 1) * 2000);
        });
    } else if (lowerMessage.includes('doctor') || lowerMessage.includes('profile')) {
        responses.doctor.forEach((response, index) => {
            setTimeout(() => addBotMessage(response), (index + 1) * 2000);
        });
    } else if (lowerMessage.includes('developer') || lowerMessage.includes('develop')) {
        responses.developer.forEach((response, index) => {
            setTimeout(() => addBotMessage(response), (index + 1) * 2000);
        });
    } else if (lowerMessage.includes('lab results') || lowerMessage.includes('medical test')) {
        responses.lab_results.forEach((response, index) => {
            setTimeout(() => addBotMessage(response), (index + 1) * 2000);
        });
    } else if (lowerMessage.includes('query')) {
        responses.query.forEach((response, index) => {
            setTimeout(() => addBotMessage(response), (index + 1) * 2000);
        });
    } else if (lowerMessage.includes('feedback')) {
        responses.feedback.forEach((response, index) => {
            setTimeout(() => addBotMessage(response), (index + 1) * 2000);
        });
    } else if (lowerMessage.includes('payment')) {
        responses.payment.forEach((response, index) => {
            setTimeout(() => addBotMessage(response), (index + 1) * 2000);
        });
    } else if (lowerMessage.includes('insurance')) {
        responses.insurance.forEach((response, index) => {
            setTimeout(() => addBotMessage(response), (index + 1) * 2000);
        });
    } else if (lowerMessage.includes('health tips')) {
        responses.health_tips.forEach((response, index) => {
            setTimeout(() => addBotMessage(response), (index + 1) * 2000);
        });
    } else if (lowerMessage.includes('careers')) {
        responses.careers.forEach((response, index) => {
            setTimeout(() => addBotMessage(response), (index + 1) * 2000);
        });
    } else if (lowerMessage.includes('news')) {
        responses.news.forEach((response, index) => {
            setTimeout(() => addBotMessage(response), (index + 1) * 2000);
        });
    } else if (lowerMessage.includes('newsletter')) {
        responses.newsletter.forEach((response, index) => {
            setTimeout(() => addBotMessage(response), (index + 1) * 2000);
        });
    } else if (lowerMessage.includes('faq')) {
        responses.faq.forEach((response, index) => {
            setTimeout(() => addBotMessage(response), (index + 1) * 2000);
        });
    } else if (lowerMessage.includes('contact')) {
        responses.contact.forEach((response, index) => {
            setTimeout(() => addBotMessage(response), (index + 1) * 2000);
        });
    } else {
        addBotMessage("I understand. How else can I assist you today?");
    }
}

// Allow sending message with Enter key
chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
