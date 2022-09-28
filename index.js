import express from "express";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { registerValidation } from "./validations/auth.js";
import { validationResult } from "express-validator";
import UserModel from "./models/User.js";
import NoteModel from "./models/Note.js";
import jwt from "jsonwebtoken";
import checkAuth from "./utils/checkAuth.js";
import { newNoteValidation } from "./validations/note.js";

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("DB ok!"))
  .catch(err => console.log(err));

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//         get

app.get("/users", async (req, res) => {
  res.status(200).send(await UserModel.find());
});

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await UserModel.findById(id);
  if (user) return res.status(200).send(user);
  res.status(404).json({ message: "Нету пользователя" });
});

app.get("/notes", checkAuth, async (req, res) => {
  try {
    const notes = await NoteModel.find({ userId: req.decoded._id });

    res.json(notes);
  } catch (err) {
    res.status(401).json({ msg: err.message });
  }
});

//        post

app.post("/sign-in", async (req, res) => {
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

app.post("/notes", checkAuth, async (req, res) => {
  try {
    const { title, text, settings, accessType } = req.body;

    const doc = new NoteModel({
      userId: req.decoded._id,
      title,
      text,
      settings,
      accessType,
    });

    const newNote = await doc.save();

    res.json(newNote);
  } catch (err) {
    res.status(401).json({ msg: err.message });
  }
});

//        patch

app.patch("/notes/:id", [checkAuth, newNoteValidation], async (req, res) => {
  try {
    const { id } = req.params;
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array()[0]);
    }

    const updatedNote = await NoteModel.findByIdAndUpdate(id, { ...req.body });

    res.status(200).send(updatedNote);
  } catch (err) {
    res.status(401).json({ msg: err.message });
  }
});

app.listen(process.env.PORT, () =>
  console.log("Server started on port", process.env.PORT)
);
