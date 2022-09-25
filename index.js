import express from "express";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { registerValidation } from "./validations/auth.js";
import { validationResult } from "express-validator";
import UserModel from "./models/User.js";
import jwt from "jsonwebtoken";

const doc = new UserModel();

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("DB ok!"))
  .catch(err => console.log(err));

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;

  const currentUser = await UserModel.findOne({ email });

  if (await bcrypt.compare(password, currentUser.passwordHash)) {
    const token = jwt.sign(
      {
        _id: currentUser._id,
      },
      process.env.JWT_SECRET
    );

    const { email, _id } = currentUser._doc;

    res.json({
      email,
      _id,
      token,
    });
  } else {
    res.send({ msg: "Not defined" });
  }
});

app.post("/sign-up", registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array()[0]);
    }

    const { email, password, lastName, firstName, age } = req.body;
    const checkUser = await UserModel.findOne({ email });

    if (checkUser)
      return res.status(409).json({ message: "e-mail уже зарегистрован!" });

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
      message: "Не удалось зарегистрирваться",
    });
  }
});

app.get("/users", async (req, res) => {
  res.status(200).send(await UserModel.find());
});

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await UserModel.findById(id);
  if (user) return res.status(200).send(user);
  res.status(404).json({ message: "Нету пользователя" });
});

app.listen(process.env.PORT);
