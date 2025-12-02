// server/utils/emailService.js
let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (error) {
  console.warn('⚠️  nodemailer not installed. Email functionality will be disabled.');
  nodemailer = null;
}

// Create transporter - configure with your email service
// For development, you can use Gmail, Outlook, or a service like SendGrid
const createTransporter = () => {
  // Check if nodemailer is installed
  if (!nodemailer) {
    return null;
  }

  // Check if email credentials are configured
  // Support both SMTP_* and EMAIL_* env var names
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const port = process.env.SMTP_PORT || process.env.EMAIL_PORT || 587;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.warn('⚠️  Email credentials not configured. Password reset emails will be logged to console only.');
    return null;
  }

  const transportOptions = host ? {
    host,
    port: parseInt(port, 10),
    secure: parseInt(port, 10) === 465, // true for 465, false for other ports
    auth: { user, pass }
  } : {
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: { user, pass }
  };

  // Use the correct nodemailer API
  return nodemailer.createTransport(transportOptions);
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetCode) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@jayathuralifecare.com',
    to: email,
    subject: 'Password Reset Verification Code - Jayathura LifeCare',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #ABE7B2; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #2C3E50; margin: 0;">Jayathura LifeCare</h1>
        </div>
        <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #2C3E50;">Password Reset Request</h2>
          <p style="color: #546E7A; line-height: 1.6;">
            You have requested to reset your password. Please use the verification code below to proceed:
          </p>
          <div style="background-color: #FFFFFF; border: 2px solid #ABE7B2; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #2C3E50; font-size: 32px; letter-spacing: 8px; margin: 0;">${resetCode}</h1>
          </div>
          <p style="color: #546E7A; line-height: 1.6;">
            This code will expire in <strong>10 minutes</strong>. If you didn't request this, please ignore this email.
          </p>
          <p style="color: #546E7A; line-height: 1.6; margin-top: 30px;">
            Best regards,<br>
            <strong>Jayathura LifeCare Team</strong>
          </p>
        </div>
      </div>
    `
  };

  try {
    if (transporter) {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Password reset email sent to ${email}`);
    } else {
      // Log to console for development
      console.log('📧 Password Reset Email (Development Mode):');
      console.log('   To:', email);
      console.log('   Code:', resetCode);
      console.log('   ⚠️  Configure EMAIL_USER and EMAIL_PASS in .env to send real emails');
    }
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    // Don't throw - let the route handle it gracefully
    // The code is still saved in DB, so user can proceed
    console.log('⚠️  Email sending failed, but verification code is saved in database');
    return false;
  }
};

module.exports = {
  sendPasswordResetEmail
};

