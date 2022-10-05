const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose").default;
require("dotenv").config();

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("DB OK!"))
  .catch(err => {
    throw err;
  });

const app = express();

const notesRouter = require("./controllers/notes.controller");
const authRouter = require("./controllers/auth.controller");
const userRoute = require("./controllers/user.controller");
const accountRouter = require("./controllers/account.controller");
const accessRouter = require("./controllers/access.controller");

const authGuard = require("./utils/auth.guard");

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000/" }));
app.use(express.urlencoded({ extended: true }));

app.use("/notes", authGuard, notesRouter);
app.use("/account", authGuard, accountRouter);
app.use("/accesses", authGuard, accessRouter);
app.use("/auth", authRouter);
app.use("/users", userRoute);

app.listen(process.env.PORT, () => console.log("PORT", process.env.PORT));
