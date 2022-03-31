const User = require("../model/userModel");
const bcrypt = require("bcrypt")
module.exports.login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({ email });
        if (!user )
            return res.json({ msg: "Correo incorrecto", status: false });

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid)
            return res.json({ msg: "Contraseña incorrecta", status: false });

        if (user.hasAcount == false)
            return res.json({ msg: "Acceso denegado", status: false });

        delete user.password;
        return res.json({ status: true, user})
    } catch (error) {
        next(error)
    }
};

module.exports.newChatUser = async (req, res, next) => {
    try {
        const { email, name } = req.body;

        const user = await User.create({
            email,
            name,
        })

        return res.json({ status: true, user})
    } catch (error) {
        next(error)
    }
};
module.exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({ _id: { $ne: req.params.id } }).select([
            "email",
            "name",
            "_id",
        ]).sort({ _id: -1});
        return res.json(users);
    } catch (error) {
        next(error)
    }
};

module.exports.getAdminUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ hasAcount: true });
        if (!user )
            return res.json({ msg: "no se encontro", status: false });
        delete user.password;
        return res.json({ status: true, user})
    } catch (error) {
        next(error)
    }
};