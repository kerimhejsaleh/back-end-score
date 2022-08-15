const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  url: {
    type: String,
  },
  title: {
    type: String,
  },
  desc: {
    type: String,
  },
  created_date: { 
     type: Date
  },
  etat: {
    type: Boolean,
  },
  role: {
    type: Boolean,
  },
});

module.exports = mongoose.model("video", userSchema);