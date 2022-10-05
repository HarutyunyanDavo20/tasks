const { validationResult } = require("express-validator");
const UserModel = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = require("express").Router();

router.post("/sign-in", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        algorithm: "HS256",
      });

      const { email, _id } = user._doc;

      res.json({
        email,
        _id,
        token,
      });
    } else {
      res.status(401).json({ message: "Incorrect email or password!" });
    }
  } catch (err) {
    res.status(500).json({
      message: "Failed to login",
    });
  }
});

router.post("/sign-up", async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array()[0]);
    }

    const { email, password, lastName, firstName, age } = req.body;
    const checkUser = await UserModel.findOne({ email });

    if (checkUser) {
      return res.status(409).json({ message: "this e-mail is used" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const doc = new UserModel({
      email,
      password: passwordHash,
      lastName,
      firstName,
      age,
    });

    const user = await doc.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      message: "Failed to register",
    });
  }
});

module.exports = router;
