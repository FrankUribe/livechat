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
        delete user.isActive;
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
            "isActive",
            "phone",
            "country",
            "city",
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

module.exports.updateIsActive = async (req, res, next) => {
    try {
        const {id, status} = req.body;
        await User.updateOne({ _id: id }, { isActive: status })
    } catch (error) {
        next(error)
    }
};

module.exports.updateChatUser = async (req, res, next) => {
    try {
        const {id, name, email, phone, country, city} = req.body;
        const user = await User.updateOne({ _id: id }, { 
            email: email,
            name: name,
            phone: phone,
            country: country,
            city: city,
        })
        if (user)
            return res.json({ msg: "Los datos se han actualizado exitosamente", status: true });
    } catch (error) {
        next(error)
    }
};