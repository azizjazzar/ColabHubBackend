const express = require("express");
const router = express.Router();
const multerUpload = require("../middleware/multer-config.js");
const {
  register,
  users,
  getByEmail,
  remove,
  update,
  sendmail,
  login,
  logout,
  getById,
  refreshToken,
  updateI,
  usersI,
  getByEmailI,
  registerI,
  comparePasswords,
  updatePicture,
  getImageById,
  getImageByEmail
} = require("../controllers/auth");
const { verifyTokenMiddleware } = require("../middleware/auth");

router.route("/register").post(register);
router.route("/update/:email").put(update);
router.route("/users").get(users);
router.route("/user/:email").get(getByEmail);
router.route("/email/:email/:code").get(sendmail);
router.route("/user/delete/:email").delete(remove);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/logout").post(logout);
router.route("/userid/:id").get(getById);

//multer
router.route("/updatePicture/:email").put(multerUpload, updatePicture); 
router.route("/image/:email").get(getImageByEmail);
router.route("/imageId/:id").get(getImageById);
//I
router.route("/updateI/:email").put(updateI);
router.route("/usersI").get(usersI);
router.route("/userI/:email").get(getByEmailI);
router.route("/registerI").post(registerI);
router.route("/comparePasswords").post(comparePasswords);


module.exports = router;
