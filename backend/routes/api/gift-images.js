const express = require("express");
const router = express.Router();
const { requireAuth } = require("../../utils/auth");
const { Gift, GiftImage } = require("../../db/models");

router.get("/:imageId", async (req, res) => {
  try {
    const imageId = req.params.imageId;
    const giftImage = await GiftImage.findByPk(imageId);

    if (giftImage) {
      res.json(giftImage);
    } else {
      res.status(404).json({ message: "Image not found" });
    }
  } catch (error) {
    console.error("Error retrieving image: ", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:imageId", requireAuth, async (req, res) => {
  try {
    const { imageId } = req.params;
    const imageIdNumber = parseInt(imageId);

    const image = await GiftImage.findByPk(imageIdNumber, {
      include: { model: Gift, attributes: ["userId"] },
    });

    if (!image) {
      return res.status(404).json({
        message: "Gift Image couldn't be found",
      });
    }

    // Check if the current user is the owner of the spot image
    if (image.Gift.userId !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized: You do not have permission to delete this spot",
      });
    }

    // Delete the image from the database
    image.destroy();

    return res.status(200).json({
      message: "Successfully deleted",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
