const mongoose = require('mongoose');

const FormsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    created_date: { type: Date, required: true },
    update_date: { type: Date, required: true },
    sections: { type: Array, required: true },
    formMuti: { type: Array, required: true },
    messages: { type: Array, required: true },
    formule: { type: String, required: true },
    archived: { type: Boolean, required: true },
    status: { type: Boolean, required: true },
    genre: { type: String, required: true },
    password: { type: String },
    nameAff: { type: String, required: true  },
    etat: { type: Boolean, required: true },
})
let Forms = mongoose.model('forms', FormsSchema);

module.exports = { Forms };