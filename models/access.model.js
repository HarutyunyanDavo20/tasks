const mongoose = require('mongoose').default

const AccessSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  note_id: {
    type: String,
    required: true
  },
})

module.exports = mongoose.model('Access', AccessSchema)