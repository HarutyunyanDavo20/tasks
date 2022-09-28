const express = require("express")
const mongoose = require("mongoose").default
require('dotenv').config();

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("DB ok!"))
  .catch(err => console.log(err));

const app = express();

const notesRouter = require('./controllers/notesController');
const authRouter = require('./controllers/authController');
const userRoute = require('./controllers/userController');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/notes', notesRouter);
app.use('/auth', authRouter)
app.use('/users', userRoute)

app.listen(process.env.PORT, () =>
  console.log("Server started on port", process.env.PORT)
);
