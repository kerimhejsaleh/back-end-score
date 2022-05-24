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

router.post('/addaffectationallforms', verifyToken, async (req, res,next) => {
 /*    console.log("req.body",req.body) */
    try {
        obj = req.body;
        var arr = [1,2,3,4,5];


      await  obj.map(async (result) =>{
            let doctor = await Doctor.findOne({ _id: result.user, archived: false })
            let form = await Forms.findOne({ _id: result.form, archived: false }) 
          if (!doctor || !form) {
                return res.status(404).send({ message: "Not found" })
            } 
        /*     console.log(doctor.name) */
            
            
                let affectation = new Affectation(result);
                affectation.date = "2022-05-10T13:26:46.296+00:00";
                
             let aff = await Affectation.findOne({ user: result.user, form: result.form }) 
             if (!aff) {
          
                await affectation.save()
                  res.status(200).send({ affected: 1 })
                  return
                 
            } else {
                res.status(200).send({ affected: 0 });
                return
              
            }
        })
        for  (let i=0;i<obj.length;i++){
   
           
            
        
     
        }

    } catch (error) {
    
        res.status(400).send({ message: "Erreur", error });
    }
/*     try {
        obj = req.body;
        let doctor = await Doctor.findOne({ _id: obj.user, archived: false })
        
       
      let updatedoctor = await Doctor.findByIdAndUpdate({ _id: obj.user }, {
            $set: {
                account_state_dossier_affectation:true
            }
        })
        console.log("eeee",updatedoctor) 
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
    } */
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
router.get('/getaffectationall', verifyToken, async (req, res) => {
    try {
       
        let affectations = await Affectation.find()
  /*     console.log(affectations.length) */
      const taile =affectations.length
        res.status(200).send({taile:taile,allForms:affectations});
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
/* console.log(req.params.user) */
    try {
        let doctor = await Doctor.findOne({ _id: req.params.user, archived: false })
      /*   console.log("doctor",doctor) */
        let form = await Forms.findOne({ _id: req.params.form, archived: false })
      /*   console.log("form",form) */
        if (!doctor || !form) {
        /*     console.log("Not found") */
            return res.status(404).send({ message: "Not found" })
        }
        let deletedAffectation = await Affectation.findOneAndDelete({ user: req.params.user, form: req.params.form })
 /*        console.log("deletedAffectation",req.params.user) */
        let updatedoctor = await Doctor.findByIdAndUpdate({ _id: req.params.user }, {
            $set: {
                account_state_dossier_affectation:false
            }
        })
     /*    console.log("eeee",updatedoctor)  */
        if (!deletedAffectation) {
       /*      console.log("not") */
            res.status(404).send('not found')
        } else {
      /*       console.log("yessssssssssss") */
            res.status(200).send(deletedAffectation);
        }

    } catch (error) {
    /*     console.log("Erreur") */
        res.status(400).send({ message: "Erreur", error });
    }

});
router.delete('/getTotalFormAffecter/:user/:form', verifyToken, async (req, res) => {
 /*    console.log(req.params.user) */
        try {
            let doctor = await Doctor.findOne({ _id: req.params.user, archived: false })
            let form = await Forms.findOne({ _id: req.params.form, archived: false })
            if (!doctor || !form) {
             /*    console.log("Not found") */
                return res.status(404).send({ message: "Not found" })
            }
            let deletedAffectation = await Affectation.findOneAndDelete({ user: req.params.user, form: req.params.form })
          /*   console.log("deletedAffectation",req.params.user) */
            let updatedoctor = await Doctor.findByIdAndUpdate({ _id: req.params.user }, {
                $set: {
                    account_state_dossier_affectation:false
                }
            })
      /*       console.log("eeee",updatedoctor)  */
            if (!deletedAffectation) {
               /*  console.log("not") */
                res.status(404).send('not found')
            } else {
               /*  console.log("yessssssssssss") */
                res.status(200).send(deletedAffectation);
            }
    
        } catch (error) {
          /*   console.log("Erreur") */
            res.status(400).send({ message: "Erreur", error });
        }
    
    });
module.exports = router;