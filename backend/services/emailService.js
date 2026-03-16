const nodemailer = require("nodemailer");

const sendReminderEmail = async (to, subscriptionName, expiryDate) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: `Subscription Expiry Reminder`,
    html: `
      <h3>Reminder</h3>
      <p>Your subscription <b>${subscriptionName}</b> will expire on <b>${expiryDate}</b>.</p>
      <p>Please renew it to avoid service interruption.</p>
    `
  };

  await transporter.sendMail(mailOptions);

};

module.exports = sendReminderEmail;