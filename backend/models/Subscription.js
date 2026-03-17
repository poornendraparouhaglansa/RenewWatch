const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  name: String,

  type: {
    type: String,
    enum: ["domain", "ssl", "hosting", "other"]
  },

  provider: {
    type: String,
  },

  amount: {
    type: Number,
  },

  currency: {
    type: String,
    default: "USD",
  },

  billingCycle: {
    type: String,
    enum: ["one-time", "monthly", "quarterly", "yearly"],
    default: "yearly",
  },

  autoRenew: {
    type: Boolean,
    default: true,
  },

  notes: {
    type: String,
  },

  notificationEmail: {
    type: String,
  },

  expiryDate: Date,

  reminderDays: Number,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Subscription", SubscriptionSchema);