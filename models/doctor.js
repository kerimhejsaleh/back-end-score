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
    archived: { type: Boolean, required: true },
    fax: { type: String, required: true },
    gender: { type: String, required: true },
    job: { type: String, required: true },
    adeli: { type: Number, required: true },
    rpps: { type: Number, required: true },
    role: { type: Number, required: true },
})
let Doctor = mongoose.model('doctor', DoctorSchema);

module.exports = { Doctor };