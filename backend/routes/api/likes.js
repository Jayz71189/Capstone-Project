const express = require("express");
const router = express.Router();
const { check, query } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");
const { Op, Sequelize } = require("sequelize");

const { Like, Comment, User, Gift, GiftImage } = require("../../db/models");

// Get all Likes of the Current User
router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;

  const likes = await Like.findAll({
    where: {
      userId: user.id,
    },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Gift,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    ],
  });

  return res.status(200).json({ Likes: likes });
});

module.exports = router;
