const express = require('express');
const router = express.Router();
const { Doctor } = require('../models/doctor');
const { Achat } = require('../models/achat');
const  Achat2  = require('../models/achat');
router.get("/", async (req, res) => {
    try {
        obj = req.body;
        let doctor = await Doctor.findOne({ _id: obj.user })
      res.status(200).send({doctor :doctor});
    } catch (err) {
      console.log(err);
    }
  });
router.post('/addachat', async (req, res) => {
    try {
        obj = req.body;
        let doctor = await Doctor.findOne({ _id: obj.user })
        let achatForm = await Achat.findOne({ user: obj.user })
        /* console.log("achatForm",achatForm) */
         if (!doctor) {
            return res.status(404).send({ message: "Not found" })
        }
         if(achatForm==null) {
            
            let achat = new Achat(obj);           
            await achat.save()
            return res.status(200).send({ achat: true })
         }
         if(achatForm!=null){
     /*        console.log("hii") */
            achaUpdate = await Achat.findByIdAndUpdate({ _id: achatForm._id }, { $set: {  datedefin: obj.datedefin,
                datedebut: obj.datedebut,
              } });
                return res.status(200).send({achaUpdate :achaUpdate});
         }


    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
    }
});
router.post('/addachatan', async (req, res) => {
    try {
        obj = req.body;
        let doctor = await Doctor.findOne({ _id: obj.user })
        let achatForm = await Achat.findOne({ user: obj.user })
        /* console.log("achatForm",achatForm) */
         if (!doctor) {
            return res.status(404).send({ message: "Not found" })
        }
         if(achatForm==null) {
            
            let achat = new Achat(obj);           
            await achat.save()
            return res.status(200).send({ achat: true })
         }
         if(achatForm!=null){
     /*        console.log("hii") */
            achaUpdate = await Achat.findByIdAndUpdate({ _id: achatForm._id }, { $set: {  datedefin: obj.datedefin,
                datedebut: obj.datedebut,
              } });
                return res.status(200).send({achaUpdate :achaUpdate});
         }


    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
    }
});
  module.exports = router;