const { Router } = require("express");
const {handleCheckUserLogin,handleCreateAccount, handleUserLogout, handleGetUserRole} = require('../controllers/user');
const authUser = require("../middlewares/auth");
const { check } = require("express-validator");

const router = Router();
const registerValidation = [
    check("fullName", "Full Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be 6 or more characters").isLength({
      min: 6,
    }),
  ];
  
  const loginValidation = [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ];
router.get('/:id/role', handleGetUserRole)

router.post("/login",loginValidation, handleCheckUserLogin);

router.post("/signup",registerValidation, handleCreateAccount);

router.post("/logout", authUser, handleUserLogout);

// --> controlled by frontend

// router.get("/logout", (req, res) => {
//   res.clearCookie("token").json({ result: "logout" });
// });

module.exports = router;
