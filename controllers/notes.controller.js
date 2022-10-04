const { validationResult } = require("express-validator");
const NoteModel = require("../models/note.model.js");
const AccessModel = require("../models/access.model");
const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    const notes = await NoteModel.find({ userId: req.user._id });
    res.status(200).json(notes);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

router.get("/accesses/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const accessesEmails = await AccessModel.find({ note_id: id });

    res.status(200).send(accessesEmails);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

router.post("/accesses", async (req, res) => {
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

router.delete("/accesses/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await AccessModel.findByIdAndDelete(id);

    res.status(200).json({ message: "OK" });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, text, settings, accessType } = req.body;

    const doc = new NoteModel({
      userId: req.user._id,
      title,
      text,
      settings,
      accessType,
    });

    const newNote = await doc.save();

    res.status(201).json(newNote);
  } catch (err) {
    console.log(err.message);
    res.status(401).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array()[0]);
    }

    const updatedNote = await NoteModel.update(
      { _id: id },
      {
        ...req.body,
      }
    ).getUpdate();

    res.status(200).send(updatedNote);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const message = await NoteModel.findByIdAndDelete(id);

    await AccessModel.deleteMany({ note_id: id });

    res.status(200).json({ message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
