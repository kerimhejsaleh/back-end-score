const mongoose = require('mongoose');
const InsideSchema = new mongoose.Schema({
    dossier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "dossiers",
        required: true,
    },
    form: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "forms",
        required: true,
    },
    date: { type: Date, required: true },
})
let Inside = mongoose.model('Inside', InsideSchema);

module.exports = { Inside };