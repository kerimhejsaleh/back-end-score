const express = require('express');
const video = require("../models/urlvideo");
const router = express.Router();
const { Video } = require('../models/urlvideo');


  router.post('/', async (req, res) => {

    try {
      let obj = req.body;
      let urlVi = new video({
        url: obj.url,
        title: obj.title,
        desc:obj.desc,
        etat: false,
        role:false,
        created_date :new Date()
      }); 
      await urlVi.save();
    /*   let urlV = await video.save() */
      console.log("urlV",urlVi)
       return res.status(200).send(urlVi);

    } catch (error) {
      return res.status(400).send({ message: "Erreur", error });
    }
  });
  router.get("/:id", async (req, res) => {
    try {
      // Find user by id
      let urlV = await video.findById(req.params.id);
      res.json(urlV);
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
      res.json("urlV");
    } catch (err) {
      console.log(err);
    }
  });
  router.put("/:id", async (req, res) => {
    try {
 
      urlV = await video.findByIdAndUpdate(req.params.id, { role: true });
      res.json(urlV);
    } catch (err) {
      console.log(err);
    }
  });
  module.exports = router;