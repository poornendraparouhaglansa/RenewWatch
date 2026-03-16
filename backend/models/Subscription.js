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

  expiryDate: Date,

  reminderDays: Number,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Subscription", SubscriptionSchema);