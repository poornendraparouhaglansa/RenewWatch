const Subscription = require("../models/Subscription");
const User = require("../models/User");
const nodemailer = require("nodemailer");

/* CREATE SUBSCRIPTION */
exports.createSubscription = async (req, res) => {
  try {
    const {
      name,
      type,
      expiryDate,
      reminderDays,
      provider,
      amount,
      currency,
      billingCycle,
      autoRenew,
      notes,
      notificationEmail,
    } = req.body;

    const subscription = await Subscription.create({
      userId: req.user,
      name,
      type,
      expiryDate,
      reminderDays,
      provider,
      amount,
      currency,
      billingCycle,
      autoRenew,
      notes,
      notificationEmail,
    });

    // fire-and-forget confirmation email
    try {
      const user = await User.findById(req.user);

      if (user && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const toEmail =
          notificationEmail || user.notificationEmail || user.email;
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: toEmail,
          subject: "Renew Watch - Subscription added",
          html: `
            <h3>New subscription added</h3>
            <p>You just added a new subscription in <b>Renew Watch</b>.</p>
            <ul>
              <li><b>Name:</b> ${name}</li>
              <li><b>Type:</b> ${type}</li>
              <li><b>Expiry:</b> ${new Date(expiryDate).toDateString()}</li>
              <li><b>Reminder window:</b> ${reminderDays} day(s) before expiry</li>
            </ul>
            <p>You’ll also receive reminder emails when this subscription is close to expiring.</p>
          `,
        });
      }
    } catch (emailError) {
      console.error("Failed to send subscription created email:", emailError);
    }

    res.status(201).json(subscription);

  } catch (error) {
    res.status(500).json(error.message);
  }
};


/* GET USER SUBSCRIPTIONS */
exports.getSubscriptions = async (req, res) => {
  try {

    const subscriptions = await Subscription.find({
      userId: req.user
    });

    res.json(subscriptions);

  } catch (error) {
    res.status(500).json(error.message);
  }
};


/* UPDATE SUBSCRIPTION */
exports.updateSubscription = async (req, res) => {
  try {

    const updated = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (error) {
    res.status(500).json(error.message);
  }
};


/* DELETE SUBSCRIPTION */
exports.deleteSubscription = async (req, res) => {
  try {

    await Subscription.findByIdAndDelete(req.params.id);

    res.json({ message: "Subscription deleted" });

  } catch (error) {
    res.status(500).json(error.message);
  }
};