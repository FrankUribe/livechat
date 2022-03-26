const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const app = express();
require("dotenv").config();

app.use(cors());
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

const server = app.listen(process.env.PORT,()=>{
  console.log(`Servidor en puerto: ${process.env.PORT}`)
})