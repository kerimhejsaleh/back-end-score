const mongoose = require('mongoose');
let ObjectId = require('mongodb').ObjectID;

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
    date: { type: Date, required: true },
    dateRemplissage: { type: Date },
    etat: { type: Boolean, required: true },
})
let Affect = mongoose.model('affect', AffectSchema);

module.exports = { Affect };