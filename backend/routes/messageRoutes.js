const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { sendMessage, allMessages, getMessage, deleteMessage, editMessage, } = require("../controllers/messageControllers");
const { uploadFile } = require("../controllers/uploadFileController");

const router = express.Router();

router.route('/file/').post(protect, uploadFile)
router.route('/').post(protect, sendMessage)
router.route('/:chatId').get(protect, allMessages)
router.route('/get/:messageId').get(protect, getMessage)
router.route('/:messageId').delete(protect, deleteMessage)
router.route('/').put(protect, editMessage)
module.exports = router;