const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const { Affect } = require('../models/affect');
const { Invitation } = require('../models/invitation');
const { verifyToken } = require('../middlewares/verifyToken');
const { Doctor } = require('../models/doctor');
const { Patient } = require('../models/patient');

const router = express.Router();

router.post('/adddemande', verifyToken, async (req, res) => {
    try {
       
        let obj = req.body;
      /*   console.log(1,obj) */
        let doctor = await Doctor.findOne({ _id: obj.doctor, archived: false })
        let patient = await Patient.findOne({ _id: obj.patient, archived: false })
     /*    console.log(2,doctor,patient) */
        if (!doctor || !patient) {
            return res.status(404).send({ message: "Not found" })
        }
        let dem = await Invitation.findOne({ patient: obj.patient, doctor: obj.doctor });
        if (dem) {
            res.status(200).send({ message: "Already sent !!" });
        } else {
            let demande = new Invitation(obj);
            demande.status = false;

            let saveddemandeation = await demande.save()
            res.send(saveddemandeation);
        }

    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
    }
});
router.post('/getmystatus', verifyToken, async (req, res) => {
    try {
       
        let obj = req.body;
        let doctor = await Doctor.findOne({ _id: obj.doctor, archived: false })
        let patient = await Patient.findOne({ _id: obj.patient, archived: false })
         
        if (!doctor || !patient) {
            return res.status(200).send({ message: "Not found" })
        }
        let dem = await Invitation.findOne({ patient: obj.patient, doctor: obj.doctor });
        if (dem) {
            res.status(200).send({ message: "Already sent !!" });
        }

    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
    }
});
router.post('/getInvitation', verifyToken, async (req, res) => {
    try {
       
        let obj = req.body;
        let doctor = await Doctor.findOne({ _id: obj.doctor, archived: false })
         
        if (!doctor) {
            return res.status(200).send({ message: "Not found" })
        }
        let dem = await Invitation.find({   doctor: obj.doctor });
        if (dem) {
            res.status(200).send({ res: dem});
        }

    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
    }
});
router.post('/getInvitationdemande', verifyToken, async (req, res) => {
    try {
       
        let obj = req.body;
        let doctor = await Doctor.findOne({ _id: obj.doctor, archived: false })
         
        if (!doctor) {
            return res.status(200).send({ message: "Not found" })
        }
        let dem = await Invitation.find({   doctor: obj.doctor,status:false }).populate('patient');
        if (dem) {
            res.status(200).send({ res: dem});
        }

    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
    }
});
router.get('/checkdemande/:patient/:doctor', verifyToken, async (req, res) => {
    try {
        let p = req.params.patient;
        let d = req.params.doctor;

        let doctor = await Doctor.findOne({ _id: d, archived: false })
        let patient = await Patient.findOne({ _id: p, archived: false })

        if (!doctor || !patient) {
            return res.status(404).send({ message: "Not found" })
        }

        let demandeations = await Invitation.findOne({ patient: p, doctor: d })
        if (!demandeations) {
            res.status(404).send('not found')
        } else {
            res.status(200).send(demandeations);
        }
    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
    }
});

router.get('/getmydoctor/:id', verifyToken, async (req, res) => {
    try {
        let id = req.params.id;
        const ObjectId = mongoose.Types.ObjectId;

        let patient = await Patient.findOne({ _id: id, archived: false })

        if (!patient) {
            return res.status(404).send({ message: "Not found" })
        }

        doctorslist = [];

        let demandes = await Invitation
            .aggregate(
                [
                    {
                        $match: {
                            patient: ObjectId(id),
                            status: true,
                        }
                    },
                    {
                        $lookup: {
                            from: "doctors",
                            localField: "doctor",
                            foreignField: "_id",
                            as: 'doctors'
                        }
                    },
                ]
            )
        for (let i = 0; i < demandes.length; i++) {
            let doctor = {
                doctors: demandes[i].doctors[0],
                forms: null
            };
            if (demandes[i].doctors[0] && !demandes[i].doctors[0].archived) {
                let affects = await Affect.find({ user: id, doctor: demandes[i].doctors[0]._id }).populate("form");
                let lengthForm = 0;
                for (const affect of affects) {
                    if (affect.form && !affect.form.archived) {
                        lengthForm++
                    }
                }
                doctor.forms = lengthForm;
                doctorslist.push(doctor);
            }
        }
        return res.status(200).send(doctorslist)
    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
    }
});

router.get('/getmydemands/:id', verifyToken, async (req, res) => {
    try {
        let id = req.params.id;
        const ObjectId = mongoose.Types.ObjectId;

        let patient = await Patient.findOne({ _id: id, archived: false })

        if (!patient) {
            return res.status(404).send({ message: "Not found" })
        }

        let demandes = await Demande
            .aggregate(
                [
                    {
                        $match: {
                            patient: ObjectId(id),
                            status: false,
                        }
                    },
                    {
                        $lookup: {
                            from: "doctors",
                            localField: "doctor",
                            foreignField: "_id",
                            as: 'doctors'
                        }
                    },
                    {
                        $unwind: "$doctors"
                    }, {
                        $project: {
                            doctors: 0
                        }
                    }
                ]
            )

        return res.status(200).send(demandes)
    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
    }
});

router.get('/getmypatient/:id', verifyToken, async (req, res) => {
    try {
        let id = req.params.id;
        const ObjectId = mongoose.Types.ObjectId;

        let doctor = await Doctor.findOne({ _id: id, archived: false })
        if (!doctor) {
            return res.status(404).send({ message: "Not found" })
        }

        patientslist = [];

        let demandes = await Invitation
            .aggregate(
                [
                    {
                        $match: {
                            doctor: ObjectId(id),
                            status: true,
                        }
                    },
                    {
                        $lookup: {
                            from: "patients",
                            localField: "patient",
                            foreignField: "_id",
                            as: 'patients'
                        }
                    },
                ]
            )
        for (let i = 0; i < demandes.length; i++) {
            let patient = {
                patients: demandes[i].patients[0],
                forms: null
            };
            if (demandes[i].patients[0] && !demandes[i].patients[0].archived) {
                let affects = await Affect.find({ doctor: id, user: demandes[i].patients[0]._id })
                patient.forms = affects.length;
                patientslist.push(patient);
            }
        }
        res.status(200).send(patientslist)
    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
    }
});

router.get('/getdemande/:id', verifyToken, async (req, res) => {
    try {
        let id = req.params.id;
      
        const ObjectId = mongoose.Types.ObjectId;

        let patient = await Patient.findOne({ _id: id, archived: false });
       
        if (!patient) {
            return res.status(400).send({ message: "Not found" })
        }

        patientslist = [];

        let demandes = await Invitation
            .aggregate(
                [
                    {
                        $match: {
                            patient: ObjectId(id),
                            status: false
                        }
                    },
                    {
                        $lookup: {
                            from: "doctors",
                            localField: "doctor",
                            foreignField: "_id",
                            as: 'doctors'
                        }
                    },
                ]
            )
        for (let i = 0; i < demandes.length; i++) {
            patientslist.push(
                {
                    doctor: demandes[i].doctors[0],
                    status: demandes[i].status,
                    _id: demandes[i]._id
                }
            );
        }
        res.status(200).send(patientslist)
    } catch (error) {
        res.status(404).send({ message: "Erreur", error });
    }
});

//
router.get('/getincompletedform/:id', verifyToken, async (req, res) => {
    try {
        let id = req.params.id;
        const ObjectId = mongoose.Types.ObjectId;

        let demandes = await Invitation
            .aggregate(
                [
                    {
                        // ? 🚧
                        $match: {
                            user: ObjectId(id),
                            etat: false,
                        }
                    },
                    {
                        $lookup: {
                            from: "forms",
                            localField: "form",
                            foreignField: "_id",
                            as: 'forms'
                        }
                    },
                ]
            )

        let forms = [];

        for (let i = 0; i < demandes.length; i++) {
            if (!demandes[i].forms[0].archived) {
                forms.push(demandes[i].forms[0]);
            }
        }

        res.status(200).send(forms)

    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
    }
});

router.delete('/deletedemande/:id', verifyToken, async (req, res) => {
    try {
        let id = req.params.id;

        let deleteddemandeation = await Invitation.findByIdAndDelete({ _id: id })

        if (!deleteddemandeation) {
            res.status(200).send('not found')
        } else {
            res.status(200).send(deleteddemandeation);
        }
    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
    }
});

router.put('/updatedemande/:id', verifyToken, async (req, res) => {
    try {
        let id = req.params.id;
        console.log(id)
        let updateddemande = await Invitation.findByIdAndUpdate({ _id: id }, { status: true })

        if (!updateddemande) {
            res.status(404).send('not found')
        } else {
            res.status(200).send({res:'accepted'});
        }
    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
        console.log(error);
    }
});

module.exports = router;