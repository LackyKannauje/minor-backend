const express = require("express");
const multer = require("multer");
const Animal = require("../models/animal");
const router = express.Router();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    const animals = await Animal.find();
    res.status(200).json(animals);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch animals" });
  }
});

router.post("/add", upload.single("image"), async (req, res) => {
  const { category, description, status, location, contact } = req.body;

  const image = req.file ? req.file.filename : null;

  const animal = new Animal({
    category,
    description,
    status,
    location,
    contact,
    image,
  });

  try {
    const savedAnimal = await animal.save();
    res.status(201).json(savedAnimal);
  } catch (err) {
    res.status(500).json({ message: "Failed to add animal" });
  }
});

module.exports = router;
