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
            datemsg = d.getHours() + ":" + d.getMinutes();
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
                datetime: datemsg,
            };
        });
        res.json(projectedMessages);
    } catch (ex) {
        next(ex);
    }
};