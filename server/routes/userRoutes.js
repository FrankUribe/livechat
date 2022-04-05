const { login, newChatUser, getAllUsers, getAdminUser, updateIsActive } = require("../controllers/userControllers")

const router = require("express").Router();

router.post("/login", login);
router.post("/newchatuser", newChatUser)
router.get("/allusers/:id", getAllUsers);
router.post("/adminuser", getAdminUser);
router.post("/updateactive", updateIsActive)

module.exports = router;