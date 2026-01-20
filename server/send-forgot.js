// server/send-forgot.js
// Usage: node send-forgot.js user@example.com

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const { sendPasswordResetEmail } = require('./utils/emailService');

async function main() {
  const emailArg = process.argv[2];
  if (!emailArg) {
    console.error('Usage: node send-forgot.js user@example.com');
    process.exit(1);
  }

  const normalizedEmail = emailArg.toLowerCase().trim();

  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    console.error('User not found:', normalizedEmail);
    process.exit(2);
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const resetExpires = new Date();
  resetExpires.setMinutes(resetExpires.getMinutes() + 10);

  user.passwordResetCode = resetCode;
  user.passwordResetExpires = resetExpires;
  await user.save();
  console.log('Saved reset code for', user.email);

  const sent = await sendPasswordResetEmail(user.email, resetCode);
  if (sent) {
    console.log('Verification code emailed to', user.email);
  } else {
    console.log('Email not sent; check server logs, but code saved in DB:', resetCode);
  }

  process.exit(0);
}

main().catch(err => {
  console.error('Error in send-forgot.js:', err);
  process.exit(3);
});
