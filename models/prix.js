const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  prix: {
    type: String,
  },
  currency: {
    type: String,
  },
  desc: {
    type: String,
  },
});

module.exports = mongoose.model("Prix", userSchema);