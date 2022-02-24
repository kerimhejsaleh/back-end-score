const mongoose = require('mongoose');

const AffectationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "doctors",
        required: true,
    },
    form: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "forms",
        required: true,
    },
    date: { type: Date, required: true },
})
let Affectation = mongoose.model('affectation', AffectationSchema);

module.exports = { Affectation };