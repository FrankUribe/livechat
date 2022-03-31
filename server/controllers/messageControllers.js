const Messages = require("../model/messageModel");

module.exports.addMessage = async (req, res, next) => {
    try {
        const { from, to, message } = req.body;
        const data = await Messages.create({
            message: { text: message },
            users: [from, to],
            sender: from,
        });

        if (data) return res.json({ msg: "Mensaje enviado." });
        else return res.json({ msg: "Error en la base de datos" });
    } catch (ex) {
        next(ex);
    }
};

module.exports.getMessages = async (req, res, next) => {
    try {
        const { from, to } = req.body;

        const messages = await Messages.find({
            users: {
                $all: [from, to],
            },
        }).sort({ updatedAt: 1 });

        const projectedMessages = messages.map((msg) => {
            const d = new Date(msg.updatedAt);
            const now = new Date();
            var time = d.getHours() + ":" + d.getMinutes();
            var date = d.getDate() + "/" + d.getMonth();
            var datenow = now.getDate() + "/" + now.getMonth();
            if (datenow !== date) {
                time = time + ' ' + date;
            }
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
                datetime: time,
            };
        });
        res.json(projectedMessages);
    } catch (ex) {
        next(ex);
    }
};
module.exports.getLastMessage = async (req, res, next) => {
    try {
        const { from, to } = req.body;

        const message = await Messages.find({
            users: {
                $all: [from, to],
            },
        }).sort({ _id: -1 }).limit(1);
        
        return res.json( message )
    } catch (ex) {
        next(ex);
    }
};