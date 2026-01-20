const nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();

// POST /api/contact
router.post('/', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  // Configure nodemailer transporter (use your SMTP credentials)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'jayathuralifecare@gmail.com',
      pass: 'xzfqlmhmtabbfedj', // Replace with your Google App Password
    },
  });

  const mailOptions = {
    from: email,
    to: 'jayathuralifecare@gmail.com',
    subject: subject || 'Contact Form Submission',
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || ''}\nMessage: ${message}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f6f8fa; padding: 32px;">
        <div style="max-width: 520px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(44,62,80,0.07); overflow: hidden;">
          <div style="background: linear-gradient(90deg, #ABE7B2 0%, #CBF3BB 100%); padding: 24px 32px; text-align: center;">
            <h2 style="margin: 0; color: #2C3E50; font-size: 1.6rem; font-weight: 700;">New Contact Form Submission</h2>
          </div>
          <div style="padding: 28px 32px 24px 32px;">
            <p style="font-size: 1.1rem; color: #546E7A; margin-bottom: 18px;">You have received a new message from the website contact form:</p>
            <table style="width: 100%; font-size: 1rem; color: #2C3E50; border-collapse: collapse;">
              <tr><td style="font-weight: 600; padding: 8px 0; width: 120px;">Name:</td><td>${name}</td></tr>
              <tr><td style="font-weight: 600; padding: 8px 0;">Email:</td><td>${email}</td></tr>
              <tr><td style="font-weight: 600; padding: 8px 0;">Phone:</td><td>${phone || '-'}</td></tr>
              <tr><td style="font-weight: 600; padding: 8px 0;">Subject:</td><td>${subject || '-'}</td></tr>
              <tr><td style="font-weight: 600; padding: 8px 0; vertical-align: top;">Message:</td><td style="white-space: pre-line;">${message}</td></tr>
            </table>
            <div style="margin-top: 32px; text-align: center;">
              <a href="mailto:${email}" style="display: inline-block; background: #ABE7B2; color: #2C3E50; font-weight: 600; padding: 10px 28px; border-radius: 6px; text-decoration: none; font-size: 1rem; box-shadow: 0 2px 8px rgba(171,231,178,0.12);">Reply to ${name}</a>
            </div>
          </div>
          <div style="background: #f6f8fa; color: #90CAF9; text-align: center; font-size: 0.95rem; padding: 12px 0; border-top: 1px solid #e0e0e0;">
            Jayathura LifeCare &copy; ${new Date().getFullYear()}
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending contact email:', error);
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

module.exports = router;
