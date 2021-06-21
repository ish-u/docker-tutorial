const mongoose = require("mongoose");

const NotesSchema = mongoose.Schema({
  note: {
    type: String,
  },
});

module.exports = mongoose.model("NotesSchema", NotesSchema);
