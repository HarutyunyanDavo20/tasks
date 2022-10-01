const express = require("express")
const mongoose = require("mongoose").default
require('dotenv').config();

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("DB ok!"))
  .catch(err => console.log(err));

const app = express();

const notesRouter = require('./controllers/notes.controller');
const authRouter = require('./controllers/auth.controller');
const userRoute = require('./controllers/user.controller');

const authGuard = require('./utils/auth.guard');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/notes', authGuard, notesRouter);
app.use('/auth', authRouter)
app.use('/users', userRoute)

app.listen(process.env.PORT, () =>
  console.log("Server started on port", process.env.PORT)
);
