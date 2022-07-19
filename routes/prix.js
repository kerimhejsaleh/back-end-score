const express = require('express');
const prix = require("../models/prix");
const router = express.Router();
const { Video } = require('../models/urlvideo');

  router.post('/', async (req, res) => {
/* console.log('fjklmlkjhgfghj',req.body) */

    try {
        let prixTotal = await prix.find();
       
        let obj = req.body;
        if(prixTotal.length==0){
   
      let prixAdd = new prix({
        title: obj.title,
        prix: obj.prix,
        currency:obj.currency,
        desc: obj.desc,

      }); 
      await prixAdd.save();
       return res.status(200).send({prixAdd :prixAdd});
    
    }else{
       // console.log('fjklmlkjhgfghj',prixTotal[0]._id)
        prixUpdate = await prix.findByIdAndUpdate({ _id: prixTotal[0]._id }, { $set: {  title: obj.title,
            prix: obj.prix,
            currency:obj.currency,
            desc: obj.desc} });
            return res.status(200).send({prixAdd :prixUpdate});
       }

    } catch (error) {
      return res.status(400).send({ message: "Erreur", error });
    }
  });
  router.get("/", async (req, res) => {
    try {
      // Find user by id
      let prixTotal = await prix.find();
      
      res.status(200).send( prixTotal );
    
    } catch (err) {
      console.log(err);
    }
  });
  router.delete("/:id", async (req, res) => {
    try {
/* 
      await video.findByIdAndDelete({ _id: req.params.id }) */
      res.status(200).send(true);

    } catch (err) {
      console.log(err);
    }
  });
  router.put("/:id", async (req, res) => {
  /// console.log(req.body)
    try {
     
      prixUpdate = await video.findByIdAndUpdate(req.params.id,  { prix: req.body.prix });
 
     /*  urlV = await video.findOneAndUpdat( { etat: true }); */
     res.status(200).send({prixUpdate:prixUpdate});
    } catch (err) {
      console.log(err);
    }
  });
  router.put("/delete/:id", async (req, res) => {
    try {
 
    /*   urlV = await video.findByIdAndUpdate(req.params.id, { etat: false }); */
      res.status(200).send(true);
    } catch (err) {
      console.log(err);
    }
  });
  module.exports = router;