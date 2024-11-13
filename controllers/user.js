const User = require("../models/user");

async function handleCheckUserLogin(req, res) {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    return res.cookie("token", token).json({ status: true, token: token });
  } catch (error) {
    return res.status(500).json({ message: "Login Failed" });
  }
}

async function handleCreateAccount(req, res) {
  try {
    const { fullName, email, password } = req.body;
    await User.create({
      fullName,
      email,
      password,
    });
    return res.json({ status: true });
  } catch (error) {
    return res.status(500).json({ message: "Signup Failed" });
  }
}

module.exports = {
  handleCheckUserLogin,
  handleCreateAccount,
};
