const express = require("express");
const Animal = require("../models/animal");
const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const animals = await Animal.find(); 
    res.status(200).json(animals); 
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch animals" });
  }
});


router.post("/add", async (req, res) => {
  const { name, description, status, location, contact } = req.body;
  const animal = new Animal({ name, description, status, location, contact });

  try {
    const savedAnimal = await animal.save();
    res.status(201).json(savedAnimal); 
  } catch (err) {
    res.status(500).json({ message: "Failed to add animal" });
  }
});

module.exports = router;
