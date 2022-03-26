const User = require("../model/userModel");
const bcrypt = require("bcrypt")
module.exports.login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.findOne({ email });
        if (!user )
            return res.json({ msg: "Nombre de usuario incorrecto", status: false });

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid)
            return res.json({ msg: "Contraseña incorrecta", status: false });

        delete user .password;
        return res.json({ status: true, user})
    } catch (error) {
        next(error)
    }
};