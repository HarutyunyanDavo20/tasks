const { validationResult } = require("express-validator");
const UserModel = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authGuard = require("../utils/auth.guard.js");

const router = require("express").Router();

<<<<<<< HEAD:controllers/userController.js
export const getUserByToken= async (req, res) => {
  const {_id} = req.user 
  const user = await UserModel.findById(_id)

  res.status(200).json({...user._doc})
}

export const getUserByID = async (req, res) => {
  const { id } = req.params;
  const user = await UserModel.findById(id);
  if (user) {
    return res.status(200).send(user);
  }
  res.status(404).json({ message: "Not User" });
};
=======
router.get("/account", authGuard, async (req, res) => {
  const { _id } = req.user;
  const user = await UserModel.findOne({ _id });
  res.status(200).send({ ...user._doc });
});
>>>>>>> 9fa587e15590aa61972db511fb428fb1912712d9:controllers/auth.controller.js

router.post("/sign-in", async (req, res) => {
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
      email: email.toLowerCase(),
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