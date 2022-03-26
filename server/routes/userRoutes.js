const { login } = require("../controllers/userControllers")

const router = require("express").Router();

router.post("/login", login);

module.exports = router;