const router = require("express").Router();
const UserModel = require("../models/user.model");

router.get("/", async (req, res) => {
  try {
    const { _id } = req.user;

    const user = await UserModel.findOne({ _id });

    res.status(200).json(user);
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
});

module.exports = router;
