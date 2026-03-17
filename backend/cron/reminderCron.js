const cron = require("node-cron");
const Subscription = require("../models/Subscription");
const User = require("../models/User");
const sendReminderEmail = require("../services/emailService");

cron.schedule("0 9 * * *", async () => {

  console.log("Running reminder cron job...");

  const today = new Date();

  const subscriptions = await Subscription.find();

  for (let sub of subscriptions) {

    const expiry = new Date(sub.expiryDate);

    const reminderStart = new Date(expiry);
    reminderStart.setDate(expiry.getDate() - sub.reminderDays);

    if (today >= reminderStart && today <= expiry) {

      const user = await User.findById(sub.userId);

      if (user) {
        const toEmail = sub.notificationEmail || user.notificationEmail || user.email;

        await sendReminderEmail(
          toEmail,
          sub.name,
          expiry.toDateString()
        );

        console.log("Reminder sent for:", sub.name);

      }
    }
  }

});