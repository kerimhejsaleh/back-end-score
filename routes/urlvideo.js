const express = require('express');
const video = require("../models/urlvideo");
const router = express.Router();
const { Video } = require('../models/urlvideo');

  router.post('/', async (req, res) => {
console.log('fjklmlkjhgfghj',req.body)
    try {
    
      let obj = req.body;
      let urlVi = new video({
        url: obj.url.slice(32,obj.url.length),
        title: obj.title,
        desc:obj.desc,
        etat: false,
        role:obj.role,
        created_date :new Date()
      }); 
      await urlVi.save();
       return res.status(200).send(urlVi);

    } catch (error) {
      return res.status(400).send({ message: "Erreur", error });
    }
  });
  
  router.get("/", async (req, res) => {
    try {
      // Find user by id
      const dataUrlP = []
      const dataUrlD = []
      let urlV = await video.find();
      urlV.map((result)=>{
     /*    console.log(result) */
        if(result.role){
          dataUrlD.push(result)
        }
        else {
          dataUrlP.push(result)
        }
      })
      res.status(200).send({ dataUrlD: dataUrlD, dataUrlP :dataUrlP });
    
    } catch (err) {
      console.log(err);
    }
  });
  router.delete("/:id", async (req, res) => {
    try {
      // Find user by id
  /*     let urlV = await video.findById(req.params.id); */
      // Delete image from cloudinary
      // Delete user from db
      await video.findByIdAndDelete({ _id: req.params.id })
      res.status(200).send(true);

    } catch (err) {
      console.log(err);
    }
  });
  router.put("/:id", async (req, res) => {
  /// console.log(req.body)
    try {
      let urlV2 = await video.find();
   await urlV2.map(async (result)=>{
   /*  console.log(1,result._id==req.params.id,result._id,req.params.id,req.body) */
        if(result._id==req.params.id&&result.role==req.body.role){
         /*  console.log(2,result._id==req.params.id,result._id,req.params.id) */
          urlV = await video.findByIdAndUpdate(req.params.id,  { etat: true });
        }
        if(result._id!=req.params.id&&result.role==req.body.role) {
          urlV = await video.findByIdAndUpdate(result._id, { etat: false });
        }
      })
 
     /*  urlV = await video.findOneAndUpdat( { etat: true }); */
     res.status(200).send(true);
    } catch (err) {
      console.log(err);
    }
  });
  router.put("/delete/:id", async (req, res) => {
    try {
 
      urlV = await video.findByIdAndUpdate(req.params.id, { etat: false });
      res.status(200).send(true);
    } catch (err) {
      console.log(err);
    }
  });
  module.exports = router;