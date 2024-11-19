const express = require("express");
const multer = require("multer");
const Animal = require("../models/animal");
const authUser = require("../middlewares/auth");
const User = require("../models/user");
const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
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

router.get("/userId/:id", async (req, res) => {
  try {
    const user = req.params.id;
    const animals = await Animal.find({ user });
    if (!animals) {
      return res.status(404).json({ message: "Posts not found for the user" });
    }
    res.status(200).json(animals);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});

router.get("/info", async (req, res) => {
  try {
    // Fetch the counts
    const totalApplications = await Animal.countDocuments(); // Total count of all applications
    const pendingCount = await Animal.countDocuments({ status: "pending" }); // Count where status is "pending"
    const adoptedCount = await Animal.countDocuments({ status: "adopted" }); // Count where status is "adopted"
    const rescuedCount = await Animal.countDocuments({ status: "rescued" }); // Count where status is "rescued"
    const foundCount = await Animal.countDocuments({ status: "found" }); // Count where status is "found"
    const adoptionCases = await Animal.countDocuments({ caseType: "adoption" }); // Cases of type "adoption"
    const missingCases = await Animal.countDocuments({ caseType: "missing" }); // Cases of type "missing"
    const rescueCases = await Animal.countDocuments({ caseType: "rescue" }); // Cases of type "rescue"

    // Return the result as a JSON object
    res.json({
      totalApplications,
      statusCounts: {
        pending: pendingCount,
        adopted: adoptedCount,
        rescued: rescuedCount,
        found: foundCount,
      },
      caseTypeCounts: {
        adoption: adoptionCases,
        missing: missingCases,
        rescue: rescueCases,
      },
    });
  } catch (err) {
    console.error("Error fetching application counts:", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const animal = await Animal.findById(id);
    if (!animal) {
      return res.status(404).json({ message: "Animal not found" });
    }
    res.status(200).json(animal);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch animal" });
  }
});

router.get("/category/:category", async (req, res) => {
  const { category } = req.params;
  try {
    const animals = await Animal.find({ category });
    res.status(200).json(animals);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve animals" });
  }
});

router.get("/case/:type", async (req, res) => {
  const {type} = req.params;
  const validTypes = ["adoption", "missing", "rescue"];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ message: "Invalid status value" });
  }
  try {
    const animals = await Animal.find({caseType:type});
    res.status(200).json(animals);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve animals" });
  }
});

router.post("/add", authUser, upload.single("image"), async (req, res) => {
  const { category, caseType, description, location, contact } = req.body;
  const user = req.user.id; // middleware --> user to the request
  const image = req.file ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}` : null;

  const animal = new Animal({
    user,
    category,
    caseType,
    description,
    location,
    contact,
    image,
  });

  try {
    const savedAnimal = await animal.save();
    res.status(201).json(savedAnimal);
  } catch (err) {
    res.status(500).json({ message: "Failed to add animal", error: err.message });
  }
});



router.patch("/status/:id", authUser, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate status value
  const validStatuses = ["rescued", "adopted", "found"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }


  try {
    const user = await User.findById(req.user.id);
    
    const animal = await Animal.findById(id);
    if(user.role === 'USER' && animal.user.toString() !== req.user.id.toString()){
      return res.status(401).json({ message: "You have no Access" });
    }

    if (!animal) {
      return res.status(404).json({ message: "Animal not found" });
    }

    animal.status = status;
    if(user.role === 'ADMIN') {
      animal.adminAction = req.user.id;
    }
    const updatedAnimal = await animal.save();

    res.status(200).json({
      message: "Animal status updated successfully",
      animal: updatedAnimal,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update status", error: err.message });
  }
});


module.exports = router;
