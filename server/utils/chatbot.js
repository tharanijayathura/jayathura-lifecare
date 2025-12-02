// server/utils/chatbot.js
// Simple chatbot for automated responses

const botResponses = {
  greetings: [
    "Hello! I'm here to help you with your healthcare needs. How can I assist you today?",
    "Hi there! Welcome to Jayathura LifeCare. What can I help you with?",
    "Greetings! I'm your virtual assistant. Feel free to ask me anything about our services.",
  ],
  prescription: [
    "You can upload your prescription through the Patient Portal. Our pharmacists will verify it and get back to you soon.",
    "To upload a prescription, go to your Patient Portal and click on 'Upload Prescription'. Our team will review it within 24 hours.",
    "Prescription uploads are easy! Just go to the Patient Portal and use the upload feature. Our pharmacists will verify it promptly.",
  ],
  delivery: [
    "We offer fast islandwide delivery across Sri Lanka. Delivery typically takes 2-3 business days.",
    "Our delivery service covers all of Sri Lanka. You can track your order in real-time through your account.",
    "We provide reliable delivery services. Orders are usually delivered within 2-3 business days to your location.",
  ],
  medicine: [
    "You can browse our medicine catalog in the Patient Portal. We have a wide range of medicines and healthcare products.",
    "Our medicine catalog includes prescription and over-the-counter medicines. You can search by name, category, or brand.",
    "Browse our extensive medicine collection in the Patient Portal. Use filters to find exactly what you need.",
  ],
  payment: [
    "We accept various payment methods including cash on delivery, credit/debit cards, and online payments.",
    "Payment options include COD (Cash on Delivery), card payments, and secure online transactions.",
    "You can pay via cash on delivery, credit/debit cards, or through our secure online payment gateway.",
  ],
  hours: [
    "Our online platform is available 24/7. Business hours for physical location are Monday-Sunday, 8 AM to 8 PM.",
    "You can access our services online anytime. Our physical location is open Monday-Sunday from 8 AM to 8 PM.",
    "Online services are available 24/7. Visit us in person Monday-Sunday, 8 AM to 8 PM.",
  ],
  contact: [
    "You can reach us at +94 71 259 9785 or email support@jayathuralifecare.com. We're here to help!",
    "Contact us at +94 71 259 9785 or support@jayathuralifecare.com. Our team is ready to assist you.",
    "Reach out to us at +94 71 259 9785 or support@jayathuralifecare.com for any inquiries.",
  ],
  default: [
    "I understand you're looking for help. Let me connect you with one of our pharmacists who can assist you better.",
    "That's a great question! I'll make sure a pharmacist gets back to you soon with a detailed answer.",
    "I'm here to help! One of our pharmacists will respond to your query shortly.",
  ],
};

function getBotResponse(userMessage) {
  const message = userMessage.toLowerCase().trim();

  // Greetings
  if (message.match(/\b(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b/)) {
    return botResponses.greetings[Math.floor(Math.random() * botResponses.greetings.length)];
  }

  // Prescription queries
  if (message.match(/\b(prescription|prescribe|upload|doctor|medication|medicine)\b/)) {
    return botResponses.prescription[Math.floor(Math.random() * botResponses.prescription.length)];
  }

  // Delivery queries
  if (message.match(/\b(delivery|deliver|ship|shipping|when|how long|track|tracking)\b/)) {
    return botResponses.delivery[Math.floor(Math.random() * botResponses.delivery.length)];
  }

  // Medicine queries
  if (message.match(/\b(medicine|medicines|drug|drugs|catalog|available|stock|buy|purchase)\b/)) {
    return botResponses.medicine[Math.floor(Math.random() * botResponses.medicine.length)];
  }

  // Payment queries
  if (message.match(/\b(payment|pay|price|cost|bill|billing|money|card|cash)\b/)) {
    return botResponses.payment[Math.floor(Math.random() * botResponses.payment.length)];
  }

  // Hours queries
  if (message.match(/\b(hours|open|close|time|when|available|business)\b/)) {
    return botResponses.hours[Math.floor(Math.random() * botResponses.hours.length)];
  }

  // Contact queries
  if (message.match(/\b(contact|phone|email|address|location|reach|call)\b/)) {
    return botResponses.contact[Math.floor(Math.random() * botResponses.contact.length)];
  }

  // Default response
  return botResponses.default[Math.floor(Math.random() * botResponses.default.length)];
}

module.exports = { getBotResponse };

