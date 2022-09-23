import express from "express";
import session from "express-session";
import bcrypt from "bcrypt";
import { MongoClient } from "mongodb";
import { ObjectID } from "bson";

const client = new MongoClient(
  "mongodb+srv://davit:qwerty123456@cluster0.smt2era.mongodb.net/?retryWrites=true&w=majority"
);

const users = client.db().collection("users");

const start = async () => {
  try {
    await client.connect();
  } catch (err) {
    console.log(err);
  }
};
start();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const currentUser = await users.findOne({ email });
  if (await bcrypt.compare(password, currentUser.password)) {
    res.send(currentUser);
  }
  res.send({ msg: "Not defined" });
});
app.post("/signup", async (req, res) => {
  const { firstName, lastName, age, email, password } = req.body;

  const hashedPass = await bcrypt.hash(password, 10);
  users.insertOne({
    firstName,
    lastName,
    age,
    email,
    password: hashedPass,
  });

  res.redirect("/signin");
});
app.get("/users", async (req, res) => {
  res.send(await users.find().toArray());
});
app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  res.send(await users.findOne({ _id: ObjectID(id) }));
});

app.listen(process.env.PORT);
