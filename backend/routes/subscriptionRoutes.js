const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createSubscription,
  getSubscriptions,
  updateSubscription,
  deleteSubscription,
} = require("../controllers/subscriptionController");


router.post("/", authMiddleware, createSubscription);

router.get("/", authMiddleware, getSubscriptions);

router.put("/:id", authMiddleware, updateSubscription);

router.delete("/:id", authMiddleware, deleteSubscription);

module.exports = router;