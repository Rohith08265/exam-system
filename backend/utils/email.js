const nodemailer = require('nodemailer');

/**
 * Create email transporter
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send email
 */
const sendEmail = async (to, subject, htmlContent) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

/**
 * Send welcome email
 */
const sendWelcomeEmail = (email, firstName) => {
  const subject = 'Welcome to Exam System';
  const htmlContent = `
    <h2>Welcome, ${firstName}!</h2>
    <p>Thank you for registering with Exam System.</p>
    <p>You can now login and start taking exams.</p>
    <p>Visit: <a href="${process.env.FRONTEND_URL}">Exam System</a></p>
  `;
  return sendEmail(email, subject, htmlContent);
};

/**
 * Send result notification email
 */
const sendResultEmail = (email, firstName, examTitle, marks, totalMarks) => {
  const percentage = ((marks / totalMarks) * 100).toFixed(2);
  const subject = `Exam Result: ${examTitle}`;
  const htmlContent = `
    <h2>Exam Results</h2>
    <p>Hi ${firstName},</p>
    <p>Your results for <strong>${examTitle}</strong> are ready!</p>
    <p>
      <strong>Score:</strong> ${marks}/${totalMarks} (${percentage}%)<br>
      <strong>Status:</strong> ${percentage >= 60 ? 'PASSED' : 'FAILED'}
    </p>
    <p><a href="${process.env.FRONTEND_URL}/results">View Detailed Results</a></p>
  `;
  return sendEmail(email, subject, htmlContent);
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const subject = 'Password Reset Request';
  const htmlContent = `
    <h2>Password Reset</h2>
    <p>You requested a password reset.</p>
    <p><a href="${resetUrl}">Click here to reset your password</a></p>
    <p>This link expires in 1 hour.</p>
    <p>If you didn't request this, ignore this email.</p>
  `;
  return sendEmail(email, subject, htmlContent);
};

/**
 * Send exam scheduled notification
 */
const sendExamScheduledEmail = (email, firstName, examTitle, startDate) => {
  const subject = `Exam Scheduled: ${examTitle}`;
  const htmlContent = `
    <h2>Exam Scheduled</h2>
    <p>Hi ${firstName},</p>
    <p>An exam has been scheduled for you.</p>
    <p>
      <strong>Exam:</strong> ${examTitle}<br>
      <strong>Date:</strong> ${new Date(startDate).toLocaleString()}
    </p>
    <p><a href="${process.env.FRONTEND_URL}/exams">View Exam</a></p>
  `;
  return sendEmail(email, subject, htmlContent);
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendResultEmail,
  sendPasswordResetEmail,
  sendExamScheduledEmail,
};
