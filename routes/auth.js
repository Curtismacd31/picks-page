const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

router.use(express.urlencoded({ extended: true }));

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.send("Invalid login");
  }
  req.session.user = { id: user._id, displayName: user.displayName };
  res.redirect("/dashboard");
});

module.exports = router;
