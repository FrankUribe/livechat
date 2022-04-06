const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const app = express();
const socket = require("socket.io")
const bodyParser = require('body-parser')
require("dotenv").config();

app.use(cors());
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Conectada");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/auth", userRoutes)
app.use("/api/messages", messageRoutes)

const server = app.listen(process.env.PORT,()=>{
  console.log(`Servidor en puerto: ${process.env.PORT}`)
})


const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });

  socket.on("setActiveUser", () => {
    io.emit("activeUser");
  });
});