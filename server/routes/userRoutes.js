const { login, newChatUser, getAllUsers, getAdminUser } = require("../controllers/userControllers")

const router = require("express").Router();

router.post("/login", login);
router.post("/newchatuser", newChatUser)
router.get("/allusers/:id", getAllUsers);
router.post("/adminuser", getAdminUser);

module.exports = router;