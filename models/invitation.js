const mongoose = require('mongoose');

const InvitationSchema = new mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "doctor",
        required: true,
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "patient",
        required: true,
    },
    status: { type: Boolean, required: true },
})
let Invitation = mongoose.model('invitation', InvitationSchema);

module.exports = { Invitation };