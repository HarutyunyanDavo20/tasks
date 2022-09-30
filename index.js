import express from "express";
import mongoose from "mongoose";
import checkAuth from "./utils/checkAuth.js";
import cors from "cors";
import { noteValidation } from "./validations/note.js";
import { registerValidation } from "./validations/auth.js";
import * as userController from "./controllers/userController.js";
import * as noteController from "./controllers/notesController.js";

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("DB ok!"))
  .catch(err => console.log(err));

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));

app.get("/users", userController.getUsers);
app.get("/account", checkAuth, userController.getUserByToken);
app.get("/users/:id", userController.getUserByID);
app.post("/sign-in", userController.signIn);
app.post("/sign-up", registerValidation, userController.signUp);

app.get("/notes", checkAuth, noteController.getNotes);
app.post("/notes", checkAuth, noteController.create);
app.put("/notes/:id", [checkAuth, noteValidation], noteController.updateNote);
app.delete("/notes/:id", checkAuth, noteController.deleteNote);

app.listen(process.env.PORT, () =>
  console.log("Server started on port", process.env.PORT)
);
