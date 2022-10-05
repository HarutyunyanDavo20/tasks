const router = require("express").Router();
const AccessModel = require("../models/access.model");

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const accessesEmails = await AccessModel.find({ note_id: id });
    res.status(200).send(accessesEmails);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { user_id, note_id } = req.body;
    const doc = new AccessModel({
      user_id,
      note_id,
    });
    await doc.save();
    res.status(200).json(doc);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await AccessModel.findByIdAndDelete(id);
    res.status(200).json({ message: "OK" });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

module.exports = router;
