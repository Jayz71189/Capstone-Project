const express = require("express");
const bcrypt = require("bcryptjs");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password, username, firstName, lastName } = req.body;
  const hashedPassword = bcrypt.hashSync(password);
  const user = await User.create({
    email,
    username,
    firstName,
    lastName,
    hashedPassword,
  });

  const safeUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
  };

  await setTokenCookie(res, safeUser);

  return res.status(201).json({
    user: safeUser,
  });
});

router.get("/:id", async (req, res) => {
  // const hashedPassword = bcrypt.hashSync(password);
  const user = await User.findByPk(req.params.id);

  // const safeUser = {
  //   id: user.id,
  //   firstName: user.firstName,
  //   lastName: user.lastName,
  //   email: user.email,
  //   username: user.username,
  // };

  // await setTokenCookie(res, safeUser);
  try {
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(201).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// router.get("/:id/spots", requireAuth, async (req, res) => {

module.exports = router;
