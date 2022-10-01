const { validationResult } = require("express-validator");
const NoteModel = require("../models/note.model.js");
const router = require('express').Router();

router.get('/', async (req, res) => {
  try {
    const notes = await NoteModel.find({ userId: req.user._id });
    res.status(200).json(notes);
  } catch (err) {
    res.status(401).json({ message: err.message });
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
    res.status(401).json({ message: err.message });
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array()[0]);
    }

    const updatedNote = await NoteModel.findOneAndUpdate(id, { ...req.body }).getUpdate();
   
    res.status(200).send(updatedNote);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const message = await NoteModel.findByIdAndDelete(id);
    res.status(200).json({ message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

module.exports = router
