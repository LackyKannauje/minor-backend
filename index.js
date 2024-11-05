const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const userRoute = require("./routes/user");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

const app = express();
const PORT = 8000;

mongoose
  .connect("mongodb://127.0.0.1:27017/authentication")
  .then((e) => console.log("mongodb connected!!"));


app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.use("/user", userRoute);

app.listen(PORT, () => console.log("server started!!"));
