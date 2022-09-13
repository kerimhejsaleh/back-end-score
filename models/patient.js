const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    birthday: { type: String, required: true },
    photo: { type: String  },
    ssn: { type: String },
    adresse: { type: String, required: true },
    tel: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    added_date: { type: Date, required: true },
    account_state: { type: Boolean, required: true },
    archived: { type: Boolean, required: true },
    gender: { type: String, required: true },
})
let Patient = mongoose.model('patient', PatientSchema);

module.exports = { Patient };