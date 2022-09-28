import { validationResult } from "express-validator";
import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
  res.status(200).send(await UserModel.find());
};

export const getUserByID = async (req, res) => {
  const { id } = req.params;
  const user = await UserModel.findById(id);
  if (user) {
    return res.status(200).send(user);
  }
  res.status(404).json({ message: "Not User" });
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (user && (await bcrypt.compare(password, user.passwordHash))) {
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
    res.status(401).json({ msg: "Incorrect email or password!" });
  }
};

export const signUp = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array()[0]);
    }

    const { email, password, lastName, firstName, age } = req.body;
    const checkUser = await UserModel.findOne({ email });

    if (checkUser)
      return res.status(409).json({ message: "this e-mail is used" });

    const passwordHash = await bcrypt.hash(password, 10);

    const doc = new UserModel({
      email,
      passwordHash,
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
};
