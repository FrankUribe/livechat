const { login, newChatUser, getAllUsers, getAdminUser, updateIsActive, updateChatUser } = require("../controllers/userControllers")

const router = require("express").Router();

router.post("/login", login);
router.post("/newchatuser", newChatUser)
router.get("/allusers/:id", getAllUsers);
router.post("/adminuser", getAdminUser);
router.post("/updateactive", updateIsActive)
router.post("/updatechatuser", updateChatUser)

module.exports = router;