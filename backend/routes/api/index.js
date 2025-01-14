// backend/routes/api/index.js
const router = require("express").Router();
const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");
const giftsRouter = require("./gifts.js");
const giftImagesRouter = require("./gift-images.js");
const commentsRouter = require("./comments.js");
const purchasesRouter = require("./purchases.js");
const likesRouter = require("./likes.js");

const { restoreUser } = require("../../utils/auth.js");

// Connect restoreUser middleware to the API router
// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use("/session", sessionRouter);

router.use("/users", usersRouter);

router.use("/gifts", giftsRouter);

router.use("/gift-images", giftImagesRouter);

router.use("/comments", commentsRouter);

router.use("/purchases", purchasesRouter);

router.use("/likes", likesRouter);

router.post("/test", (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
