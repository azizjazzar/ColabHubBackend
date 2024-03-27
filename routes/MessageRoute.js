const express = require("express");
const router = express.Router();
const { allMessages, sendMessage } = require("../controllers/messageControllers");
const { verifyTokenMiddleware } = require("../middleware/auth");
router.route("/:chatId").get(verifyTokenMiddleware, allMessages);
router.route("/sendmessage").post(verifyTokenMiddleware, sendMessage);

module.exports = router;