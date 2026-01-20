// server/test-email.js
// Usage: node test-email.js recipient@example.com

require('dotenv').config();
const nodemailer = require('nodemailer');

const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
const port = process.env.SMTP_PORT || process.env.EMAIL_PORT || 587;
const user = process.env.SMTP_USER || process.env.EMAIL_USER;
const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
const from = process.env.EMAIL_FROM || user || 'noreply@example.com';

if (!user || !pass) {
  console.error('Missing SMTP credentials. Set SMTP_USER and SMTP_PASS in server/.env');
  process.exit(1);
}

const transportOptions = host ? {
  host,
  port: parseInt(port, 10),
  secure: parseInt(port, 10) === 465,
  auth: { user, pass }
} : {
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: { user, pass }
};

const transporter = nodemailer.createTransport(transportOptions);

const to = process.argv[2] || user;
const mailOptions = {
  from,
  to,
  subject: 'Test email from Jayathura LifeCare',
  text: 'This is a test email to verify SMTP credentials.'
};

(async () => {
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response || info);
    process.exit(0);
  } catch (err) {
    console.error('Error sending test email:', err);
    process.exit(2);
  }
})();
