const UserModel = require("../models/User.js");

const router = require('express').Router();
router.get('/', async (req, res) => {
  res.status(200).send(await UserModel.find());
})

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const user = await UserModel.findById(id);
  if (user) {
    return res.status(200).send(user);
  }
  res.status(404).json({ message: "Not User" });
})

module.exports = router
