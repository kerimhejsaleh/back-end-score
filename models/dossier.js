const mongoose = require('mongoose');
const DossierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    added_date: { type: Date, required: true },
    archived: { type: Boolean, required: true }
})
let Dossier = mongoose.model('Dossier', DossierSchema);

module.exports = { Dossier };