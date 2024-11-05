const { Router } = require("express");
const {handleCheckUserLogin,handleCreateAccount} = require('../controllers/user');

const router = Router();

router.post("/login", handleCheckUserLogin);

router.post("/signup", handleCreateAccount);



// --> controlled by frontend

// router.get("/logout", (req, res) => {
//   res.clearCookie("token").json({ result: "logout" });
// });

module.exports = router;
