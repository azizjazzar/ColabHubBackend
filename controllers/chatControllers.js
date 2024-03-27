const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Chat = require("../models/chatModel");

const mongoose = require("mongoose"); // Ensure mongoose is required in the file

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage.sender", "nom email");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "nom email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "nom email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please fill all the fields." });
  }

  let users;
  try {
    const parsedUsers = JSON.parse(req.body.users);
    if (!Array.isArray(parsedUsers)) {
      throw new Error("Users should be an array.");
    }

    // Map each userId to a mongoose ObjectId, throwing an error if any ID is invalid
    users = parsedUsers.map((userId) => {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error(`Invalid user ID: ${userId}`);
      }
      return userId; // No need to convert here, Mongoose does it for you when needed
    });

    // Confirm each user ID corresponds to an existing user
    const usersExistCheck = await Promise.all(
      users.map((userId) => User.countDocuments({ _id: userId }))
    );
    if (usersExistCheck.some((count) => count === 0)) {
      // If any user doesn't exist
      throw new Error(
        "One or more user IDs do not correspond to existing users."
      );
    }
  } catch (error) {
    return res.status(400).send(error.message || "Invalid user IDs provided.");
  }

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat.");
  }

  // Validate `req.user._id` and add it to the users array
  if (!req.user || !mongoose.Types.ObjectId.isValid(req.user._id)) {
    return res.status(400).send("Invalid user information.");
  }
  const userId = new mongoose.Types.ObjectId(req.user._id);

  users.push(req.user._id);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: userId,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, newName } = req.body;

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return res.status(404).send("Chat not found.");
  }

  // Ensuring both are compared as strings
  if (chat.groupAdmin.toString() !== req.user._id.toString()) {
    return res.status(403).send("Only the group admin can rename the group.");
  }

  chat.chatName = newName;
  await chat.save();

  const updatedChat = await Chat.findById(chat._id)
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.json(updatedChat);
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    return res.status(400).send("Chat ID and user ID are required.");
  }

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return res.status(404).send("Chat not found.");
  }

  if (chat.groupAdmin.toString() !== req.user._id.toString()) {
    return res.status(403).send("Only the group admin can add users.");
  }

  if (chat.users.includes(userId)) {
    return res.status(400).send("User already in group.");
  }

  chat.users.push(userId);
  await chat.save();

  const updatedChat = await Chat.findById(chatId)
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.json(updatedChat);
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    return res.status(400).send("Chat ID and user ID are required.");
  }

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return res.status(404).send("Chat not found.");
  }

  if (
    chat.groupAdmin.toString() !== req.user._id.toString() &&
    req.user._id.toString() !== userId
  ) {
    return res
      .status(403)
      .send(
        "Only the group admin or the user themselves can remove the user from the group."
      );
  }

  chat.users = chat.users.filter((user) => user.toString() !== userId);
  await chat.save();

  const updatedChat = await Chat.findById(chatId)
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.json(updatedChat);
});

module.exports = {
  allUsers,
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
