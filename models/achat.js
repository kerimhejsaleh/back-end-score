const mongoose = require('mongoose');

const AchatSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "doctors",
        required: true,
    },
    datedefin: { type: Date, required: true },
    datedebut: { type: Date, required: true },
    type: { type: Boolean },
})
let Achat = mongoose.model('achat', AchatSchema);

module.exports = { Achat };