const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
const dotenv = require('dotenv');
const userRoute = require("./routes/user");
const animalRoute = require('./routes/animal');
dotenv.config();
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8000;

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/minor-app")
  .then((e) => console.log("mongodb connected!!"));

app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use("/images", express.static("public/images"));
app.use(express.json())
app.use("/images", express.static(path.join(process.cwd(), 'images')));
app.use("/uploads", express.static(path.join(process.cwd(), 'uploads')));

app.use("/api/user", userRoute);
app.use("/api/animal", animalRoute)
app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => console.log("server started on port 8000!!"));
