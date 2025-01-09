const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");
const { Op, Sequelize } = require("sequelize");

const { Purchase, Comment, User, Gift, GiftImage } = require("../../db/models");

// Get all Purchases of the Current User
router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;

  const purchases = await Purchase.findAll({
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

  return res.status(200).json({ Purchases: purchases });
});

const validatePurchase = [
  check("quantity").isInt({ gt: 0 }).withMessage("quantity is required"),
  handleValidationErrors,
];

router.put(
  "/:purchaseId",
  requireAuth,
  validatePurchase,
  async (req, res, next) => {
    try {
      const { purchaseId } = req.params;
      const { quantity, totalPrice, text } = req.body;

      const purchaseVar = await Purchase.findByPk(purchaseId, {
        include: [
          {
            model: Gift,
          },
        ],
      });

      //let userId = req.params.userId;
      // Make sure the current user is authorized to view their reviews
      // if (req.user.id !== parseInt(userId, 10)) {
      //   return res.status(403).json({ message: "Unauthorized" });
      // }

      // Fetch reviews with related Spot and ReviewImages

      if (!quantity || quantity === 0) {
        return res.status(404).json({
          message: "No purchases found for this user",
        });
      }
      // Return the reviews in the specified format

      if (quantity > purchaseVar.Gift.quantity) {
        return res.status(400).json({
          message: "Bad Request",
          errors: {
            name: "Quantity cannot exceed the requested quantity",
          },
        });
      }

      if (!purchaseVar) {
        const err = new Error("Purchase couldn't be found");
        err.status = 404;
        return next(err);
      }

      // Ensure the review belongs to the current user
      if (purchaseVar.userId !== req.user.id) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
      }

      // if (!reviewVar) {
      //   return res.status(404).json({
      //     message: "Review couldn't be found",
      //   });
      // }

      // if (reviewVar.userId !== req.user.id) {
      //   return res.status(403).json({
      //     message: "You do not have permission to edit this spot",
      //   });
      // }

      const errors = {};
      if (!quantity) errors.quantity = "Quantity is required";
      if (Object.keys(errors).length > 0) {
        const err = new Error("Validation error");
        err.status = 400;
        err.errors = errors;
        return next(err);
      }

      // reviewVar.review = review;

      await purchaseVar.update({
        quantity,
        totalPrice,
        text,
      });
      return res.status(200).json(purchaseVar);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occurred while fetching purchases" });
    }
  }
);

module.exports = router;
