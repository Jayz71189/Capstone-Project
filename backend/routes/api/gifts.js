const express = require("express");
const router = express.Router();
const { check, query } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");
const { Op, Sequelize } = require("sequelize");

const {
  Gift,
  GiftImage,
  Comment,
  User,
  Purchase,
  Like,
} = require("../../db/models");

//const { requireSpotOwnership } = require("../../utils/auth");

const validateQuery = [
  query("page")
    .optional()
    .default(1)
    .isInt({ min: 1 })
    .withMessage("Page must be greater than or equal to 1")
    .toInt(),
  query("size")
    .optional()
    .default(20)
    .isInt({ min: 1, max: 20 })
    .withMessage("Size must be between 1 and 20")
    .toInt(),
  query("minQuantity")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum quantity is invalid")
    .toFloat(),
  query("maxQuantity")
    .optional()
    .isFloat({ max: 9999 })
    .withMessage("Maximum quantity is invalid")
    .toFloat(),
  query("minPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum price must be greater than or equal to 0")
    .toFloat(),
  query("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum price must be greater than or equal to 0")
    .toFloat(),
  handleValidationErrors,
];

router.get("/", validateQuery, async (req, res) => {
  const { query } = req;
  query.page ||= 1;
  query.size ||= 20;
  const { page, size, minQuantity, maxQuantity, minPrice, maxPrice } = query;

  // Validate query parameters
  const errors = {};

  if (page < 1) errors.page = "Page must be greater than or equal to 1";
  if (size < 1 || size > 20) errors.size = "Size must be between 1 and 20";
  if (minQuantity && isNaN(minQuantity))
    errors.minQuantity = "Minimum quantity is invalid";
  if (maxQuantity && isNaN(maxQuantity))
    errors.maxQuantity = "Maximum quantity is invalid";
  if (minPrice && minPrice < 0)
    errors.minPrice = "Minimum price must be greater than or equal to 0";
  if (maxPrice && maxPrice < 0)
    errors.maxPrice = "Maximum price must be greater than or equal to 0";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: "Bad Request", errors });
  }

  // Query filters
  const filters = {};
  if (minQuantity) filters.quantity = { [Op.gte]: parseFloat(minQuantity) };
  if (maxQuantity)
    filters.quantity = {
      ...filters.quantity,
      [Op.lte]: parseFloat(maxQuantity),
    };
  if (minPrice) filters.price = { [Op.gte]: parseFloat(minPrice) };
  if (maxPrice)
    filters.price = { ...filters.price, [Op.lte]: parseFloat(maxPrice) };

  const limit = Math.min(size, 20); // Enforce max size limit of 20
  const offset = (page - 1) * limit;

  const gift = await Gift.findAll({
    order: [["name", "DESC"]],
    where: filters,
    limit,
    offset,
    include: [
      {
        model: GiftImage,
        as: "GiftImages",
        where: { preview: true },
      },
    ],
  });

  try {
    res
      .status(200)
      .json({ Gifts: gift, page: parseInt(page), size: parseInt(size) });
  } catch (error) {
    console.error("Error fetching gifts:", error);
    res.status(500).json({ Gifts: "Server error" });
  }
});

//Get gifts of current user
router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;

  const gifts = await Gift.findAll({
    where: { userId: user.id },
    include: [
      {
        model: GiftImage,
        // Alias defined in association
        as: "GiftImages",
        attributes: ["id", "url", "preview"],
      },
      // Alias defined in association
    ],
  });

  return res.status(200).json({ Gifts: gifts });
});

// Get all Comments by a Gift's id
router.get("/:giftId/comments", requireAuth, async (req, res) => {
  const { giftId } = req.params;
  const giftIdNumber = parseInt(giftId);

  const gift = await Gift.findByPk(giftIdNumber);

  if (!gift) {
    return res.status(404).json({
      message: "Gift couldn't be found",
    });
  }

  const comments = await Comment.findAll({
    where: {
      giftId: giftIdNumber,
    },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
    ],
  });
  return res.status(200).json({ Comments: comments });
});

router.get("/:giftId", async (req, res) => {
  try {
    const { giftId } = req.params;
    let gift = await Gift.findByPk(giftId, {
      include: [
        {
          model: User,
          as: "User",
          attributes: ["id", "firstName", "lastName"],
        },
        //     //     as: "previewImage", // Use the alias defined in the model
        //     //    attributes: ["previewImageUrl"], // Only include the URL of the preview image
        //     //  }

        {
          model: GiftImage,
          // Alias defined in association
          as: "GiftImages",
          attributes: ["id", "url", "preview"],
        },
        // Alias defined in association
      ],
    });

    // if (gift) {
    //   res.json(gift); // The response will now include previewImageUrl }
    if (!gift) {
      res.status(404).json({ message: "Gift couldn't be found" });
    }

    //const numReviews = await Review.count({ where: { spotId } });
    // Calculate numReviews and avgStarRating
    const comments = await Comment.findAll({
      where: { giftId },
      attributes: [[Sequelize.fn("COUNT", Sequelize.col("id")), "numComments"]],
      raw: true,
    });

    const purchases = await Purchase.findAll({
      where: { giftId },
      attributes: [
        [Sequelize.fn("SUM", Sequelize.col("quantity")), "numPurchase"],
      ],
      raw: true,
    });

    const { numComments } = comments[0] || {
      numComments: 0,
    };

    const { numPurchases } = purchases[0] || {
      numPurchases: 0,
    };

    const giftDetails = {
      ...gift.toJSON(),
      numComments,
      numPurchases: numPurchases
        ? parseFloat(Number(numPurchases)).toFixed(1)
        : null,
    };

    return res.status(200).json(giftDetails);
  } catch (error) {
    console.error("Error retrieving gift: ", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:giftId/comments", requireAuth, async (req, res, next) => {
  try {
    const giftId = req.params.giftId;
    const { comment } = req.body;
    const userId = parseInt(req.user.id);

    const gift = await Gift.findByPk(giftId);

    if (!gift) {
      return res.status(404).json({
        message: "Gift couldn't be found",
      });
    }
    const errors = {};
    if (!comment) errors.comment = "Comment text is required";

    if (Object.keys(errors).length > 0) {
      const err = new Error("Validation error");
      err.status = 400;
      err.errors = errors;
      return next(err);
    }
    const newComment = await Comment.create({
      userId,
      giftId,
      comment,
    });

    return res.status(201).json(newComment);

    //{ id: image.id, url: image.url });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

router.get("/:giftId/comments", async (req, res) => {
  try {
    let giftId = req.params.giftId;
    let gift = await Gift.findByPk(giftId);

    // if (spot) {
    //   res.json(spot); // The response will now include previewImageUrl }
    if (!gift) {
      res.status(404).json({ message: "Gift couldn't be found" });
    }
    const comments = await Comment.findAll({
      where: { giftId: giftId },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
      ],
    });

    if (!comments || comments.length === 0) {
      return res.status(404).json({
        message: "No comments found for this gift",
      });
    }

    // Format the response
    const commentDetails = comments.map((comment) => ({
      id: comment.id,
      userId: comment.userId,
      giftId: comment.spotId,
      comment: comment.review,
      // User: comment.User,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }));

    return res.status(200).json({ Comments: commentDetails });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.get("/:giftId/purchases", async (req, res) => {
  try {
    let giftId = req.params.giftId;
    let gift = await Gift.findByPk(giftId);

    // if (spot) {
    //   res.json(spot); // The response will now include previewImageUrl }
    if (!gift) {
      res.status(404).json({ message: "Gift couldn't be found" });
    }
    const purchases = await Purchase.findAll({
      where: { giftId: giftId },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
      ],
    });

    if (!purchases || purchases.length === 0) {
      return res.status(404).json({
        message: "No purchases found for this gift",
      });
    }

    // Format the response
    const purchaseDetails = purchases.map((purchase) => ({
      id: purchase.id,
      giftId: purchase.giftId,
      userId: purchase.userId,
      quantity: purchase.quantity,
      totalPrice: purchase.totalPrice,
      text: purchase.text,
      // User: comment.User,
      createdAt: purchase.createdAt,
      updatedAt: purchase.updatedAt,
    }));

    return res.status(200).json({ Purchases: purchaseDetails });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.post("/:giftId/purchases", requireAuth, async (req, res, next) => {
  try {
    const giftId = req.params.giftId;
    const { quantity, totalPrice, text } = req.body;
    const userId = parseInt(req.user.id);

    const gift = await Gift.findByPk(giftId);

    if (!gift) {
      return res.status(404).json({
        message: "Gift couldn't be found",
      });
    }
    const errors = {};
    if (!quantity) errors.quantity = "quantity is required";

    if (quantity > gift.quantity) {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          name: "Quantity cannot exceed the requested quantity",
        },
      });
    }

    if (Object.keys(errors).length > 0) {
      const err = new Error("Validation error");
      err.status = 400;
      err.errors = errors;
      return next(err);
    }
    const newPurchase = await Purchase.create({
      userId,
      giftId,
      quantity,
      totalPrice,
      text,
    });

    return res.status(201).json(newPurchase);

    //{ id: image.id, url: image.url });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

router.delete("/:giftId", requireAuth, async (req, res) => {
  try {
    let giftId = req.params.giftId;
    let gift = await Gift.findByPk(giftId);

    if (!gift) {
      res.status(404).json({ message: "Gift couldn't be found" });
    }
    if (gift.userId !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized: You do not have permission to delete this spot",
      });
    }

    await gift.destroy();
    return res.json({ message: "Successfully deleted" });

    // The response will now include previewImageUrl
  } catch (error) {
    //console.error("Error retrieving gift", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  // Validate body fields before creating the Gift

  const { name, description, price, quantity } = req.body;

  // to do change errors
  // if (!name || !description || !price || !quantity) {
  //   return res.status(400).json({
  //     message: "Bad Request",
  //     errors: {
  //       name: "Name must be less than 50 characters",
  //       description: "Description is required",
  //       price: "Price per day must be a positive number",
  //       quantity: "quantity must be between 1 and 10,000",
  //     },
  //   });
  // }

  if (name.length > 50) {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        name: "Name must be less than 50 characters",
      },
    });
  }

  if (quantity < 1 || quantity >= 10000) {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        name: "Quantity must be greater than 0 and less than 10000",
      },
    });
  }

  if (price <= 0) {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        price: "Price per day must be a positive number",
      },
    });
  }

  // Create a new Gift instance
  const newGift = await Gift.create({
    name,
    description,
    price,
    quantity,
    userId: req.user.id, // Assume the user ID is stored in the decoded JWT
  });

  return res.status(201).json(
    // newSpot);

    {
      // id: newGift.id,
      userId: newGift.userId,
      name: newGift.name,
      description: newGift.description,
      price: newGift.price,
      quantity: newGift.quantity,
      createdAt: newGift.createdAt,
      updatedAt: newGift.updatedAt,
    }
  );
});

router.put("/:giftId", requireAuth, async (req, res) => {
  try {
    // Validate body fields before creating the Spot

    let giftId = req.params.giftId;
    const { name, description, price, quantity } = req.body;

    if (name.length > 50) {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          name: "Name must be less than 50 characters",
        },
      });
    }

    if (quantity < 1 || quantity >= 10000) {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          name: "Quantity must be greater than 0 and less than 10000",
        },
      });
    }

    if (price <= 0) {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          price: "Price per day must be a positive number",
        },
      });
    }

    const gift = await Gift.findByPk(giftId);

    if (!gift) {
      return res.status(404).json({
        message: "Gift couldn't be found",
      });
    }

    // Step 3: Check if the spot belongs to the current user
    if (gift.userId !== req.user.id) {
      // assuming req.user.id contains the authenticated user's ID
      return res.status(403).json({
        message: "You do not have permission to edit this spot",
      });
    }

    // Step 4: Update the spot with the new data
    // res.status(201).json(
    // newSpot);

    //   {
    //     id: Spot.id,
    //     ownerId: Spot.ownerId,
    //     address: Spot.address,
    //     city: Spot.city,
    //     state: Spot.state,
    //     country: Spot.country,
    //     lat: Spot.lat,
    //     lng: Spot.lng,
    //     name: Spot.name,
    //     description: Spot.description,
    //     price: Spot.price,
    //     createdAt: Spot.createdAt,
    //     updatedAt: Spot.updatedAt,
    //   }
    // );
    // Save the updated spot to the database

    // Create a new Spot instance
    // const newSpot = await Spot.create({
    //   address,
    //   city,
    //   state,
    //   country,
    //   lat,
    //   lng,
    //   name,
    //   description,
    //   price,
    //   ownerId: req.user.id, // Assume the user ID is stored in the decoded JWT
    // });

    gift.name = name;
    gift.description = description;
    gift.price = price;
    gift.quantity = quantity;
    await gift.save();
    return res.status(200).json(gift);
    //   // newSpot);

    //   {
    //     id: newSpot.id,
    //     ownerId: newSpot.ownerId,
    //     address: newSpot.address,
    //     city: newSpot.city,
    //     state: newSpot.state,
    //     country: newSpot.country,
    //     lat: newSpot.lat,
    //     lng: newSpot.lng,
    //     name: newSpot.name,
    //     description: newSpot.description,
    //     price: newSpot.price,
    //     createdAt: newSpot.createdAt,
    //     updatedAt: newSpot.updatedAt,
    //   }
    // );
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

//     // For unexpected errors, send a generic server error
//     res.status(500).json({ message: "Server error" });
//   }
// });

router.post("/:giftId/images", requireAuth, async (req, res) => {
  let giftId = req.params.giftId;
  let { url, preview } = req.body;

  try {
    // Check if the spot exists
    const giftImage = await Gift.findByPk(giftId);

    if (!giftImage) {
      return res.status(404).json({ message: "Gift couldn't be found" });
    }

    // Check if the current user is the owner of the spot
    if (giftImage.userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Create the new SpotImage
    const newGiftImage = await GiftImage.create({ giftId, url, preview });

    // Return the created SpotImage
    res.status(201).json(
      newGiftImage
      //   id: spotImage.id,
      //   url: spotImage.url,
      //   preview: spotImage.preview,
    );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

// Get all Likes by a Gift's id
router.get("/:giftId/likes", requireAuth, async (req, res) => {
  const { giftId } = req.params;
  const giftIdNumber = parseInt(giftId);

  const gift = await Gift.findByPk(giftIdNumber);

  if (!gift) {
    return res.status(404).json({
      message: "Gift couldn't be found",
    });
  }

  const likes = await Like.findAll({
    where: {
      giftId: giftIdNumber,
    },
  });
  return res.status(200).json({ Likes: likes });
});

// Like a Gift

router.post("/:giftId/likes", requireAuth, async (req, res, next) => {
  try {
    const giftId = req.params.giftId;
    const userId = parseInt(req.user.id);

    const gift = await Gift.findByPk(giftId, {
      include: [
        {
          model: Like,
          as: "Like",
        },
      ],
    });

    if (!gift) {
      return res.status(404).json({
        message: "Gift not found",
      });
    }

    // console.log(gift.Like);

    if (gift.Like.some((like) => like.userId === userId)) {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          name: "Already liked",
        },
      });
    }

    const newLike = await Like.create({
      userId,
      giftId,
    });

    return res.status(201).json(newLike);

    //{ id: image.id, url: image.url });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

// Unlike a Gift
router.delete("/:giftId/likes/:likeId", requireAuth, async (req, res) => {
  try {
    let likeId = parseInt(req.params.likeId);
    const userId = parseInt(req.user.id);
    let like = await Like.findOne({
      where: { id: likeId },
    });

    if (!like) {
      res.status(404).json({ message: "Like couldn't be found" });
    }
    if (like.userId !== userId) {
      return res.status(403).json({
        message:
          "Unauthorized: You do not have permission to delete this comment",
      });
    }

    await like.destroy();
    return res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    //console.error("Error retrieving spot", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
