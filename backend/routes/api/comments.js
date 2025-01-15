const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { requireAuth } = require("../../utils/auth");
const { Op, Sequelize } = require("sequelize");

const { Comment, User, Gift, GiftImage } = require("../../db/models");

// Get all Reviews of the Current User
router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;

  const comments = await Comment.findAll({
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

  return res.status(200).json({ Comments: comments });
});

// Add an Image to a Review based on the Review's id
// router.post("/:reviewId/images", requireAuth, async (req, res) => {
//   const reviewId = req.params.reviewId;
//   const { url } = req.body;
//   const userId = parseInt(req.user.id);

//   try {
//     const reviewImage = await Review.findByPk(reviewId);

//     if (!reviewImage) {
//       return res.status(404).json({
//         message: "Review couldn't be found",
//       });
//     }
//     if (reviewImage.userId !== userId) {
//       return res.status(403).json({
//         message: "Forbidden",
//       });
//     }

//     const totalImages = await ReviewImage.count({
//       where: { reviewId },
//     });

//     if (totalImages >= 10) {
//       return res.status(403).json({
//         message: "Maximum number of images for this resource was reached",
//       });
//     }

//     const newReviewImage = await ReviewImage.create({
//       url,
//       reviewId,
//     });

//     res.status(201).json(newReviewImage);

//     //{ id: image.id, url: image.url });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ message: "An error occurred", error: error.message });
//   }
// });

// Route handler to get all comments for a given user
// router.get("/", async (req, res) => {
//   const { user } = req;

//   try {

//     const comments = await Comment.findAll({
//       where: { userId: user.id },
//       include: [
//         {
//           model: User,
//           attributes: ["id", "firstName", "lastName"],
//         },
//         {
//           model: Gift,
//           attributes: { exclude: ["createdAt", "updatedAt"] },
//         },
//       ],
//     });

//     if (!comments || comments.length === 0) {
//       return res.status(404).json({
//         message: "No comments found for this user",
//       });
//     }
//     // Return the reviews in the specified format
//     const commentDetails = comments.map((comment) => ({
//       id: comment.id,
//       userId: comment.userId,
//       giftId: comment.giftId,
//       comment: comment.comment,
//       createdAt: comment.createdAt,
//       updatedAt: comment.updatedAt,
//       User: comment.User,
//       Gift: comment.Gift,
//     }));

//     return res.status(200).json({ Comments: commentDetails });
//     //res.status(200).json(reviews);
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ message: "An error occurred while fetching comments" });
//   }
// });

const validateComment = [
  check("comment").notEmpty().withMessage("Comment text is required"),
  handleValidationErrors,
];

router.put(
  "/:commentId",
  requireAuth,
  validateComment,
  async (req, res, next) => {
    try {
      let { commentId } = req.params;
      //let userId = req.params.userId;
      // Make sure the current user is authorized to view their reviews
      // if (req.user.id !== parseInt(userId, 10)) {
      //   return res.status(403).json({ message: "Unauthorized" });
      // }

      // Fetch reviews with related Spot and ReviewImages

      const { comment } = req.body;

      if (!comment || comment.length === 0) {
        return res.status(404).json({
          message: "No comments found for this user",
        });
      }
      // Return the reviews in the specified format

      const commentVar = await Comment.findByPk(commentId);

      if (!commentVar) {
        const err = new Error("Comment couldn't be found");
        err.status = 404;
        return next(err);
      }

      // Ensure the comment belongs to the current user
      if (commentVar.userId !== req.user.id) {
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
      if (!comment) errors.comment = "Comment text is required";
      if (Object.keys(errors).length > 0) {
        const err = new Error("Validation error");
        err.status = 400;
        err.errors = errors;
        return next(err);
      }

      // reviewVar.comment = comment;

      await commentVar.update({
        comment,
      });
      return res.status(200).json(commentVar);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occurred while fetching comments" });
    }
  }
);

router.delete("/:commentId", requireAuth, async (req, res) => {
  try {
    let commentId = parseInt(req.params.commentId);
    const userId = parseInt(req.user.id);
    let comment = await Comment.findOne({
      where: { id: commentId },
    });
    //   include: {
    //     model: require("../../db/models/spotImage"),
    //     as: "previewImage", // Use the alias defined in the model
    //     attributes: ["previewImageUrl"], // Only include the URL of the preview image
    //   },

    if (!comment) {
      res.status(404).json({ message: "Comment couldn't be found" });
    }
    if (comment.userId !== userId) {
      return res.status(403).json({
        message:
          "Unauthorized: You do not have permission to delete this comment",
      });
    }

    await comment.destroy();
    return res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    //console.error("Error retrieving spot", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
