const express = require("express");
const router = express.Router();
const {
  allUsers,
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
} = require("../controllers/chatControllers");
const { verifyTokenMiddleware } = require("../middleware/auth");

router.route("/searchUser").get( allUsers);
router.route("/acceschat").post(verifyTokenMiddleware, accessChat);
router.route("/fetchchat").get(verifyTokenMiddleware, fetchChats);
router.route("/addgroupe").post(verifyTokenMiddleware, createGroupChat);
router.route("/renamegroupe").post(verifyTokenMiddleware, renameGroup);
router.route("/removefromgroup").post(verifyTokenMiddleware, removeFromGroup);
router.route("/addtogroupe").post(verifyTokenMiddleware, addToGroup);
module.exports = router;
