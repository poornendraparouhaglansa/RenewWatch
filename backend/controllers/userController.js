const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password -resetOtp");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.updateMe = async (req, res) => {
  try {
    const {
      name,
      notificationEmail,
      companyName,
      phone,
      jobTitle,
      location,
      avatarUrl,
      currentPassword,
      newPassword,
    } = req.body;

    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (typeof name === "string") user.name = name;
    if (typeof notificationEmail === "string") user.notificationEmail = notificationEmail;
    if (typeof companyName === "string") user.companyName = companyName;
    if (typeof phone === "string") user.phone = phone;
    if (typeof jobTitle === "string") user.jobTitle = jobTitle;
    if (typeof location === "string") user.location = location;
    if (typeof avatarUrl === "string") user.avatarUrl = avatarUrl;

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required" });
      }

      const ok = await bcrypt.compare(currentPassword, user.password);
      if (!ok) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      const hashed = await bcrypt.hash(newPassword, 10);
      user.password = hashed;
    }

    const updated = await user.save();

    if (!updated) return res.status(404).json({ message: "User not found" });
    const safe = updated.toObject();
    delete safe.password;
    delete safe.resetOtp;
    res.json(safe);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

