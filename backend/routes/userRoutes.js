const express = require("express");
const { registerUser, authUser, allUsers, updateUser } = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser);
router.route("/").get(protect, allUsers);
router.post("/login", authUser);
router.post("/edit", updateUser)
module.exports = router;
