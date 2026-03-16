const Subscription = require("../models/Subscription");

/* CREATE SUBSCRIPTION */
exports.createSubscription = async (req, res) => {
  try {
    const { name, type, expiryDate, reminderDays } = req.body;

    const subscription = await Subscription.create({
      userId: req.user,
      name,
      type,
      expiryDate,
      reminderDays,
    });

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