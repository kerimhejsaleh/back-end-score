const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    birthday: { type: String, required: true },
    photo: { type: String, required: true },
    adresse: { type: String, required: true },
    tel: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    added_date: { type: Date, required: true },
    account_state: { type: Boolean, required: true },
    account_state_dossier_affectation: { type: Boolean, required: true },
    liste_dossier: { type: Array, required: true },
    archived: { type: Boolean, required: true },
    fax: { type: String },
    gender: { type: String  },
    
    job: { type: String, required: true },
    adeli: { type: Number},
    rpps: { type: Number, required: true },
    role: { type: Number, required: true },
})
let Doctor = mongoose.model('doctor', DoctorSchema);

module.exports = { Doctor };