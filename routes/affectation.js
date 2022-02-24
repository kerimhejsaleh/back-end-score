const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const { verifyToken } = require('../middlewares/verifyToken');
const { Affectation } = require('../models/affectation');
const { Doctor } = require('../models/doctor');
const { Forms } = require('../models/forms');

const router = express.Router();

router.post('/addaffectation', verifyToken, async (req, res) => {
    try {
        obj = req.body;
        let doctor = await Doctor.findOne({ _id: obj.user, archived: false })
        let form = await Forms.findOne({ _id: obj.form, archived: false })

        if (!doctor || !form) {
            return res.status(404).send({ message: "Not found" })
        }

        let affectation = new Affectation(obj);
        affectation.date = new Date();

        let aff = await Affectation.findOne({ user: obj.user, form: obj.form })

        if (!aff) {
            await affectation.save()
            res.status(200).send({ affected: 1 })
        } else {
            res.status(200).send({ affected: 0 });
        }
    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
    }
});

router.get('/getaffectation/:user', verifyToken, async (req, res) => {
    try {
        let doctor = await Doctor.findOne({ _id: req.params.user, archived: false })
        if (!doctor) {
            return res.status(404).send({ message: "Not found" })
        }
        let affectations = await Affectation.find({ user: req.params.user })
        res.status(200).send(affectations);
    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
    }
});

router.get('/getdoctoraffectation/:user', verifyToken, async (req, res) => {

    try {
        let doctor = await Doctor.findOne({ _id: req.params.user, archived: false })
        if (!doctor) {
            return res.status(404).send({ message: "Not found" })
        }
        let affectations = await Affectation.find({ user: req.params.user })
        res.status(200).send(affectations);
    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
    }

});
router.get('/getdoctoraffectationpopulate/:user', verifyToken, async (req, res) => {

    try {
        let doctor = await Doctor.findOne({ _id: req.params.user, archived: false })
        if (!doctor) {
            return res.status(404).send({ message: "Not found" })
        }
        let affectations = await Affectation.find({ user: req.params.user }).populate('form')
        let filtredAffectation = []
        for (const aff of affectations) {
            if (aff.form && aff.form.archived === false) {
                filtredAffectation.push(aff)
            }
        }

        res.status(200).send(filtredAffectation);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: "Erreur", error });
    }

});

router.get('/getformaffectation/:form', verifyToken, async (req, res) => {

    try {
        let form = await Forms.findOne({ _id: req.params.form, archived: false })
        if (!form) {
            return res.status(404).send({ message: "Not found" })
        }
        let affectations = await Affectation.find({ form: req.params.form })
        res.status(200).send(affectations);
    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
    }

});

router.get('/getmyform/:id', verifyToken, async (req, res) => {
    try {
        let id = req.params.id;
        let doctor = await Doctor.findOne({ _id: id, archived: false })
        if (!doctor) {
            return res.status(404).send({ message: "Not found" })
        }
        const ObjectId = mongoose.Types.ObjectId;

        let affectations = await Affectation
            .aggregate(
                [
                    {
                        $match: {
                            user: ObjectId(id)
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
                    { "$sort": { "title": 1 } }
                ]
            )

        let forms = [];

        for (let i = 0; i < affectations.length; i++) {
            if (affectations[i].forms[0] && !affectations[i].forms[0].archived) {
                forms.push(affectations[i].forms[0]);
            }
        }
        res.status(200).send(forms)

    } catch (error) {
        console.log(error);
        res.status(400).send({ message: "Erreur", error });
    }

});

router.delete('/deleteaffectation/:user/:form', verifyToken, async (req, res) => {

    try {
        let doctor = await Doctor.findOne({ _id: req.params.user, archived: false })
        let form = await Forms.findOne({ _id: req.params.form, archived: false })
        if (!doctor || !form) {
            return res.status(404).send({ message: "Not found" })
        }
        let deletedAffectation = await Affectation.findOneAndDelete({ user: req.params.user, form: req.params.form })

        if (!deletedAffectation) {
            res.status(404).send('not found')
        } else {
            res.status(200).send(deletedAffectation);
        }

    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
    }

});

module.exports = router;