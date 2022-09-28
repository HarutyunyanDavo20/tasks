const { validationResult } = require("express-validator");
const NoteModel = require("../models/Note.js");
const router = require('express').Router();

router.get('/', async (req, res) => {
  try {
    const notes = await NoteModel.find({ userId: req.user._id });
    res.json(notes);
  } catch (err) {
    res.status(401).json({ msg: err.message });
  }
})

router.post('/', async (req, res) => {
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
    res.status(401).json({ msg: err.message });
  }
})

router.put('/:id', async (req, res) => {
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
})

router.delete('/', async (req, res) => {
  try {
    const { id } = req.params;
    const msg = await NoteModel.findByIdAndDelete(id);
    res.status(200).json({ msg });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
})

module.exports = router
