const express = require("express");
const multer = require("multer");
const Animal = require("../models/animal");
const router = express.Router();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/details", async (req, res) => {
  try {
    const animals = await Animal.find();
    const animalsWithImagePath = animals.map((animal) => {
      return {
        ...animal.toObject(),
        image: animal.image ? `${req.protocol}://${req.get("host")}/images/${animal.image}` : null,
      };
    });
    res.status(200).json(animalsWithImagePath);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve animals" });
  }
});

router.get("/", async (req, res) => {
  try {
    const animals = await Animal.find();
    res.status(200).json(animals);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch animals" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const animal = await Animal.findById(id);
    res.status(200).json(animal);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch animals" });
  }
});

router.get("/category/:category", async (req, res) => {
  const { category } = req.params;
  console.log(category);
  try {
    const animals = await Animal.find({ category });
    const categorizeAnimal = animals.map((animal) => {
      // Construct the full image URL if an image exists
      return {
        ...animal.toObject(),
        image: animal.image ? `${req.protocol}://${req.get("host")}/images/${animal.image}` : null,
      };
    });
    res.status(200).json(categorizeAnimal);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve animals" });
  }
});


router.post("/add", upload.single("image"), async (req, res) => {
  const { category, description, status, location, contact } = req.body;

  const image = req.file ? req.file.filename : null;
  console.log(image, req.body);
  const animal = new Animal({
    category,
    description,
    status,
    location,
    contact,
    image,
  });
  console.log(animal);
  try {
    const savedAnimal = await animal.save();
    res.status(201).json(savedAnimal);
  } catch (err) {
    res.status(500).json({ message: "Failed to add animal" });
  }
});

module.exports = router;
