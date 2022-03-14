const express = require('express');
const bcrypt = require("bcrypt");
const multer = require('multer');
const jwt = require('jsonwebtoken');
global.atob = require("atob");
global.Blob = require('node-blob');
const { Dossier } = require('../models/dossier');
const { verifyAdminToken } = require('../middlewares/verifyToken');
const { isValidObjectId } = require('mongoose');
const { Inside } = require('../models/inside');
const { Forms } = require('../models/forms');

let filename1 = [];
///secret key
const JWT_SECRET = "htkspp678H5LLM09876BVG34HJ";

const router = express.Router();

const storage = multer.diskStorage(
  {
    destination: './upload',
    filename: function (req, file, cb) {
      date = Date.now();
      cb(null, date + '.' + file.mimetype.split('/')[1]);
      let fl = date + '.' + file.mimetype.split('/')[1];
      filename1.push(fl);
    },
  }
);

const upload = multer({ storage: storage });

router.post('/', async (req, res) => {
  try {
    let obj = req.body;
    let dossier = new Dossier(obj);

    try {

      dossier.archived = false;
      dossier.added_date = new Date();


      let saveddossier = await dossier.save()

      if (!saveddossier) {
        return res.status(404).send('not found')
      } else {
        return res.status(200).send(saveddossier);
      }
    } catch (error) {
      return res.status(400).send({ message: "Erreur", error });
    }





  } catch (error) {
    return res.status(400).send({ message: "Erreur", error });
  }
});



router.get('/:id', verifyAdminToken, async (req, res) => {
  try {
    let id = req.params.id;
    if (!isValidObjectId(id)) {
      return res.status(404).send('not found')
    }
    let dossier = await Dossier.findOne({ _id: id, archived: false })

    if (!dossier) {
      res.status(404).send('not found')
    } else {
      res.status(200).send(dossier);
    }
  } catch (error) {
    res.status(400).send({ message: "Erreur", error });
  }
});



router.get('/', verifyAdminToken, async (req, res) => {
  try {
    let dossiers = await Dossier.find({ archived: false })
    res.status(200).send(dossiers);
  } catch (error) {
    res.status(400).send({ message: "Erreur", error });
  }
});


router.put('/:id', verifyAdminToken, async (req, res) => {
  try {
    let id = req.params.id;
    let data = req.body

    let updateddossier = await Dossier.findByIdAndUpdate({ _id: id }, data, { new: true })

    if (!updateddossier) {
      res.status(404).send('not found')
    } else {

      res.status(200).send(updateddossier);
    }

  } catch (error) {
    res.status(400).send({ message: "Erreur", error });
  }
});

router.delete('/:id', verifyAdminToken, async (req, res) => {
  try {
    let id = req.params.id;

    let dossier = await Dossier.findByIdAndDelete({ _id: id })

    if (!dossier) {
      res.status(404).send('not found')
    } else {
      res.status(200).send(dossier);
    }
  } catch (error) {
    res.status(400).send({ message: "Erreur", error });
  }
});
router.get('/archived/:id', verifyAdminToken, async (req, res) => {
  console.log('hellllllppppppp de doss',req.params.id)
  let updatedDossier = await Inside.find({ dossier: req.params.id  })
   for(let i=0;i<updatedDossier.length;i++){
    await Forms.findByIdAndUpdate({ _id: updatedDossier[i].form, archived: false }, {
      $set: {
        nameAff : [{Aff1:"Aucune dossier",checked:false}],
        nameAff2 :[{Aff1:"Aucune dossier",checked:false}],
          etat :false
      }
  }) 
   }
  try {
    let id = req.params.id;

    let updatedForms = await Dossier.findByIdAndUpdate({ _id: id }, { $set: { archived: true } })

    if (!updatedForms) {
      res.status(404).send('not found')
    } else {
      res.status(200).send(updatedForms);
    }

  } catch (error) {
    res.status(400).send({ message: "Erreur", error });
  }
});

router.get('/restorer/:id', verifyAdminToken, async (req, res) => {
  try {
    let id = req.params.id;

    let updatedForms = await Dossier.findByIdAndUpdate({ _id: id }, { $set: { archived: false } })

    if (!updatedForms) {
      res.status(404).send('not found')
    } else {
      res.status(200).send(updatedForms);
    }

  } catch (error) {
    res.status(400).send({ message: "Erreur", error });
  }
});

router.get('/archive/getdossierfromarchive', verifyAdminToken, async (req, res) => {
  try {
    let dossiers = await Dossier.find({ archived: true })
    res.status(200).send(dossiers);
  } catch (error) {
    res.status(400).send({ message: "Erreur", error });
  }
});



module.exports = router;