const mongoose = require('mongoose');

const DemandeSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "patients",
        required: true,
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "doctor",
        required: true,
    },
    status: { type: Boolean, required: true },
})
let Demande = mongoose.model('demande', DemandeSchema);

module.exports = { Demande };