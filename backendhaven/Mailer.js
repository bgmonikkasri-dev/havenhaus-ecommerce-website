const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

async function sendAdminNotification(user) {
  const mailOptions = {
    from: `"HavenHaus Website" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "User Login Notification - HavenHaus",
    text: `User logged in: ${user.name} (${user.email})`,
    html: `<p><strong>User logged in:</strong> ${user.name} (${user.email})</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Admin notification sent:", info.messageId);
  } catch (error) {
    console.error("Error sending admin notification:", error);
  }
}

module.exports = sendAdminNotification;