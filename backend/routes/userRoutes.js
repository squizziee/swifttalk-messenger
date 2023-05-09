const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser);
router.route("/").get(protect, allUsers);
router.post("/login", authUser);

module.exports = router;
