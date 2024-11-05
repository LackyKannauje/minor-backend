const User = require("../models/user");

async function handleCheckUserLogin(req, res){
    const {email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    return res
      .cookie("token", token)
      .json({ status: true, token: token});
  } catch (error) {
    throw new Error(error);
  }
}

async function handleCreateAccount(req, res){
    const { fullName, email, password } = req.body;
   await User.create({
    fullName,
    email,
    password,
  });
  return res.json({status : true});
}

module.exports = {
    handleCheckUserLogin,
    handleCreateAccount,
}