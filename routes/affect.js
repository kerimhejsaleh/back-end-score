const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const { verifyToken } = require('../middlewares/verifyToken');
const { Affect } = require('../models/affect');
const { Patient } = require('../models/patient');
const { Doctor } = require('../models/doctor');
const { Forms } = require('../models/forms');

const router = express.Router();

router.post('/addaffectation', verifyToken, async (req, res) => {

    try {
        let obj = req.body;

        let patient = await Patient.findOne({ _id: obj.user, archived: false })
        let doctor = await Doctor.findOne({ _id: obj.doctor, archived: false })
        let form = await Forms.findOne({ _id: obj.form, archived: false })

        if (!patient || !doctor || !form) {
            return res.status(404).send({ message: "Not found" })
        }

        let affectation = new Affect(obj);
        affectation.date = new Date();
        affectation.dateRemplissage = null;
        affectation.etat = false;
        let aff = await Affect.findOne({ user: obj.user, form: obj.form, doctor: obj.doctor })

        if (!aff) {
            let savedAffectation = await affectation.save()

            res.status(200).send({ affected: 1 });
        } else {
            res.status(200).send({ affected: 0 });
        }

    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
    }

});

router.get('/getaffectation', verifyToken, async (req, res) => {

    try {
        let affectations = await Affect.find()
        res.status(200).send(affectations);
    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
    }

});

router.get('/getaffect/:user/:form', verifyToken, async (req, res) => {

    try {
        let patient = await Patient.findOne({ _id: req.params.user, archived: false })
        let form = await Forms.findOne({ _id: req.params.form, archived: false })

        if (!patient || !form) {
            return res.status(404).send({ message: "Not found" })
        }
        let affectation = await Affect.findOne({ user: req.params.user, form: req.params.form })
        if (!affectation) {
            res.status(404).send('not found')
        } else {
            res.status(200).send(affectation);
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: "Erreur", error });
    }

});



router.get('/getallform/:user/:doctor', verifyToken, async (req, res) => {
    try {
        let user = req.params.user;
        let doctor = req.params.doctor;

        let patientFromDb = await Patient.findOne({ _id: user, archived: false })
        let doctorFromDb = await Doctor.findOne({ _id: doctor, archived: false })

        if (!patientFromDb || !doctorFromDb) {
            return res.status(404).send({ message: "Not found" })
        }

        const ObjectId = mongoose.Types.ObjectId;

        let affect = await Affect
            .aggregate(
                [
                    {
                        $match: {
                            user: ObjectId(user),
                            doctor: ObjectId(doctor),
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

        let inCompletedForms = [];

        for (let i = 0; i < affect.length; i++) {
            let obj = {
                affectedOn: affect[i].date,
                filledOn: affect[i].dateRemplissage,
                form: affect[i].forms[0]
            }
            if (!affect[i].forms[0].archived) {
                inCompletedForms.push(obj);
            }
        }


        let affect1 = await Affect
            .aggregate(
                [
                    {
                        $match: {
                            user: ObjectId(user),
                            doctor: ObjectId(doctor),
                            etat: true,
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

        let completedForms = [];

        for (let i = 0; i < affect1.length; i++) {
            let obj = {
                affectedOn: affect1[i].date,
                filledOn: affect1[i].dateRemplissage,
                form: affect1[i].forms[0]
            }
            if (!affect1[i].forms[0].archived) {
                completedForms.push(obj);
            }
        }

        let forms = {
            completed: completedForms,
            incompleted: inCompletedForms
        }

        res.status(200).send(forms)

    } catch (error) {
        console.log(error);
        res.status(400).send({ message: "Erreur", error });
    }

});








router.get('/getcompletedform/:user/:doctor', verifyToken, async (req, res) => {

    try {
        let user = req.params.user;
        let doctor = req.params.doctor;

        let patientFromDb = await Patient.findOne({ _id: user, archived: false })
        let doctorFromDb = await Doctor.findOne({ _id: doctor, archived: false })

        if (!patientFromDb || !doctorFromDb) {
            return res.status(404).send({ message: "Not found" })
        }

        const ObjectId = mongoose.Types.ObjectId;

        let affect = await Affect
            .aggregate(
                [
                    {
                        $match: {
                            user: ObjectId(user),
                            doctor: ObjectId(doctor),
                            etat: true,
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

        for (let i = 0; i < affect.length; i++) {

            let obj = {
                affectedOn: affect[i].date,
                filledOn: affect[i].dateRemplissage,
                form: affect[i].forms[0]
            }
            if (!affect[i].forms[0].archived) {
                forms.push(obj);
            }
        }

        res.status(200).send(forms)

    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
    }
});

router.get('/getincompletedform/:user/:doctor', verifyToken, async (req, res) => {

    try {
        let user = req.params.user;
        let doctor = req.params.doctor;

        let patientFromDb = await Patient.findOne({ _id: user, archived: false })
        let doctorFromDb = await Doctor.findOne({ _id: doctor, archived: false })

        if (!patientFromDb || !doctorFromDb) {
            return res.status(404).send({ message: "Not found" })
        }

        const ObjectId = mongoose.Types.ObjectId;

        let affect = await Affect
            .aggregate(
                [
                    {
                        $match: {
                            user: ObjectId(user),
                            doctor: ObjectId(doctor),
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

        for (let i = 0; i < affect.length; i++) {
            let obj = {
                affectedOn: affect[i].date,
                filledOn: affect[i].dateRemplissage,
                form: affect[i].forms[0]
            }
            if (!affect[i].forms[0].archived) {
                forms.push(obj);
            }
        }

        res.status(200).send(forms)

    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
    }

});

router.get('/getcompletedformbydoctor/:doctor', verifyToken, async (req, res) => {

    try {

        let doctor = req.params.doctor;

        let doctorFromDb = await Doctor.findOne({ _id: doctor, archived: false })

        if (!doctorFromDb) {
            return res.status(404).send({ message: "Not found" })
        }

        const ObjectId = mongoose.Types.ObjectId;

        let affect = await Affect
            .aggregate(
                [
                    {
                        $match: {
                            doctor: ObjectId(doctor),
                            etat: true,
                        }
                    },
                    {
                        $lookup: {
                            from: "patients",
                            localField: "user",
                            foreignField: "_id",
                            as: 'patients'
                        }
                    },
                    {
                        $unwind: "$patients"
                    },
                    {
                        $lookup: {
                            from: "forms",
                            localField: "form",
                            foreignField: "_id",
                            as: "patients.forms"
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            patients: 1,
                        }
                    },
                    {
                        $match: {
                            "patients.forms": {
                                $elemMatch: { archived: false }
                            }
                        }
                    }
                ]
            )

        res.status(200).send(affect)

    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
    }
});


router.get('/getallformbydoctor/:doctor', verifyToken, async (req, res) => {

    try {

        let doctor = req.params.doctor;

        const ObjectId = mongoose.Types.ObjectId;

        let affect = await Affect
            .aggregate(
                [
                    {
                        $match: {

                            doctor: ObjectId(doctor),

                        }
                    },
                    {
                        $lookup: {
                            from: "patients",
                            localField: "user",
                            foreignField: "_id",
                            as: 'patients'
                        }
                    },
                    {
                        $unwind: "$patients"
                    },
                    {
                        $lookup: {
                            from: "forms",
                            localField: "form",
                            foreignField: "_id",
                            as: "patients.forms"
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            patients: 1,
                            dateRemplissage: 1
                        }
                    },
                    {
                        $match: {
                            "patients.forms": {
                                $elemMatch: { archived: false }
                            }
                        }
                    }
                ]
            )

        res.status(200).send(affect)

    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
    }
});





router.get('/getmyform/:user', verifyToken, async (req, res) => {
    try {
        let user = req.params.user;

        let patientFromDb = await Patient.findOne({ _id: user, archived: false })

        if (!patientFromDb) {
            return res.status(404).send({ message: "Not found" })
        }

        const ObjectId = mongoose.Types.ObjectId;

        let affect = await Affect
            .aggregate(
                [
                    {
                        $match: {
                            user: ObjectId(user),
                            etat: true,
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

        let completedForms = [];

        if (affect) {
            for (let i = 0; i < affect.length; i++) {

                let obj = {
                    affectedOn: affect[i].date,
                    filledOn: affect[i].dateRemplissage,
                    form: affect[i].forms[0],
                    doctor: affect[i].doctors[0]
                }
                if (affect[i].doctors[0] && !affect[i].doctors[0].archived && affect[i].forms[0] && !affect[i].forms[0].archived) {
                    completedForms.push(obj);
                }
            }
        }


        let affect1 = await Affect
            .aggregate(
                [
                    {
                        $match: {
                            user: ObjectId(user),
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

        let inCompletedForms = [];

        if (affect1) {
            for (let i = 0; i < affect1.length; i++) {

                let obj = {
                    affectedOn: affect1[i].date,
                    filledOn: affect1[i].dateRemplissage,
                    form: affect1[i].forms[0],
                    doctor: affect1[i].doctors[0]
                }
                if (affect1[i].doctors[0] && !affect1[i].doctors[0].archived && affect1[i].forms[0] && !affect1[i].forms[0].archived) {
                    inCompletedForms.push(obj);
                }
            }
        }

        let forms = {
            completed: completedForms,
            incompleted: inCompletedForms
        }
        res.status(200).send(forms)
    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
        console.log(error);
    }
});

router.get('/getmycompletedform/:user', verifyToken, async (req, res) => {
    try {
        let user = req.params.user;
        let patientFromDb = await Patient.findOne({ _id: user, archived: false })

        if (!patientFromDb) {
            return res.status(404).send({ message: "Not found" })
        }

        const ObjectId = mongoose.Types.ObjectId;

        let affect = await Affect
            .aggregate(
                [
                    {
                        $match: {
                            user: ObjectId(user),
                            etat: true,
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

        for (let i = 0; i < affect.length; i++) {

            let obj = {
                affectedOn: affect[i].date,
                filledOn: affect[i].dateRemplissage,
                form: affect[i].forms[0]
            }
            if (affect[i].forms[0] && !affect[i].forms[0].archived) {
                forms.push(obj);
            }
        }
        res.status(200).send(forms)
    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
    }
});

router.get('/getmyincompletedform/:user', verifyToken, async (req, res) => {
    try {
        let user = req.params.user;
        let patientFromDb = await Patient.findOne({ _id: user, archived: false })

        if (!patientFromDb) {
            return res.status(404).send({ message: "Not found" })
        }

        const ObjectId = mongoose.Types.ObjectId;

        let affectations = await Affect
            .aggregate(
                [
                    {
                        $match: {
                            user: ObjectId(user),
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

        for (let i = 0; i < affectations.length; i++) {
            let obj = {
                affectedOn: affectations[i].date,
                filledOn: affectations[i].dateRemplissage,
                form: affectations[i].forms[0]
            }
            if (affectations[i].forms[0] && !affectations[i].forms[0].archived) {
                forms.push(obj);
            }
        }
        res.send(forms)
    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
    }
});

router.delete('/deleteaffectation/:id', verifyToken, async (req, res) => {

    try {
        let id = req.params.id;

        let affectation = await Affect.findByIdAndDelete({ _id: id })

        if (!affectation) {
            res.status(404).send('not found')
        } else {
            res.status(200).send(affectation);
        }
    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
    }

});

router.put('/updateaffectation/:id', verifyToken, async (req, res) => {

    try {
        let id = req.params.id;

        let affectation = await Affect.findByIdAndUpdate({ _id: id }, { $set: { etat: true } })

        if (!affectation) {
            res.status(404).send('not found')
        } else {
            res.status(200).send(affectation);
        }

    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
    }

});

module.exports = router;