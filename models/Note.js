import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  settings: {
    backgroundColor: {
      type: String,
      required: true,
    },
    textColor: {
      type: String,
      required: true,
    },
    textAlign: {
      type: String,
      required: true,
    },
  },
  accessType: {
    type: Boolean,
    required: true,
  },
});

export default mongoose.model("Note", NoteSchema);
