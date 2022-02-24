const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    photo: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    added_date: { type: Date, required: true },
    account_state: { type: Boolean, required: true },
    archived: { type: Boolean, required: true },
})
let Admin = mongoose.model('admin', AdminSchema);
module.exports = { Admin };