const express = require('express');
const prix = require("../models/prix");
const router = express.Router();
const { Video } = require('../models/urlvideo');

  router.post('/', async (req, res) => {

    try {
        let prixTotal = await prix.find({ type: true });
        console.log(prixTotal) 
        let obj = req.body;
        if(prixTotal.length==0&&prixTotal.type){
   
      let prixAdd = new prix({
        title: obj.title,
        prix: obj.prix,
        currency:obj.currency,
        desc: obj.desc,
        type: true,

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
  router.post('/an', async (req, res) => {
    try {
        let prixTotal = await prix.find({ type: false });
       /*  console.log(req.body)  */
        let obj = req.body;
      
         if(prixTotal.length==0&&!prixTotal.type){
          let prixAdd = new prix({
            title: obj.title2,
            prix: obj.prix2,
            currency:obj.currency2,
            desc: obj.desc2,
            type: false,
    
          }); 
          await prixAdd.save();
           return res.status(200).send({prixAdd :prixAdd});
      
    
    }else{
        prixUpdate = await prix.findByIdAndUpdate({ _id: prixTotal[0]._id }, { $set: {  title: obj.title2,
            prix: obj.prix2,
            currency:obj.currency2,
            desc: obj.desc2} });
            return res.status(200).send({prixAdd :prixUpdate});
       } 

    } catch (error) {
      return res.status(400).send({ message: "Erreur", error });
    }
  });
  router.get("/", async (req, res) => {
    try {
      // Find user by id
      let prixTotal = await prix.find({ type: true });
     // console.log("prixTotal",prixTotal)
      res.status(200).send( prixTotal );
    
    } catch (err) {
      console.log(err);
    }
  });
  router.get("/an", async (req, res) => {
    try {
      // Find user by id
      let prixTotal = await prix.find({ type: false });
  //    console.log("prixTotal222222222",prixTotal)
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
    try {
      prixUpdate = await video.findByIdAndUpdate(req.params.id,  { prix: req.body.prix });
      res.status(200).send({prixUpdate:prixUpdate});
    } catch (err) {
      console.log(err);
    }
  });
  router.put("/delete/:id", async (req, res) => {
    try {
      res.status(200).send(true);
    } catch (err) {
      console.log(err);
    }
  });
  module.exports = router;