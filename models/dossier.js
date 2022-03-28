const mongoose = require('mongoose');
const DossierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    added_date: { type: Date, required: true },
    archived: { type: Boolean, required: true },
    status: { type: Boolean, required: true },
    idDossier:{ type: String, required: true },
})
let Dossier = mongoose.model('Dossier', DossierSchema);

module.exports = { Dossier };