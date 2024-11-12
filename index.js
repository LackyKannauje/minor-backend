const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require('cors')
const userRoute = require("./routes/user");
const animalRoute = require('./routes/animal');
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

const app = express();
const PORT = 8000;

mongoose
  .connect("mongodb://127.0.0.1:27017/minor-app")
  .then((e) => console.log("mongodb connected!!"));

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.use("/api/user", userRoute);
app.use("/api/animal", animalRoute)
app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => console.log("server started on port 8000!!"));
