const mongoose = require('mongoose');

const AffectSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "patient",
        required: true,
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "doctors",
        required: true,
    },
    form: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "forms",
        required: true,
    },

    form_title: { type: String, required: true },
    form_description: { type: String },
    form_created_date: { type: Date, required: true },
    form_sections: { type: Array, required: true },
    form_messages: { type: Array, required: true },
    form_formule: { type: String, required: true },
    form_archived: { type: Boolean, required: true },
    form_status: { type: Boolean, required: true },
    form_genre: { type: String, required: true },
    form_password: { type: String },

    created_date: { type: Date, required: true },
    responses: { type: mongoose.Schema.Types.Array, required: true },
    score: { type: Number, required: true },
    message: { type: String, required: true },
    state: { type: String, required: true, default: "Completed" },
    confirmationDate: { type: Date },
    archived: { type: Boolean, required: true },
})
let Response = mongoose.model('response', AffectSchema);

module.exports = { Response };