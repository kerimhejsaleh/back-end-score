const express = require('express');
const bcrypt = require("bcrypt");
const multer = require('multer');
const jwt = require('jsonwebtoken');
global.atob = require("atob");
global.Blob = require('node-blob');
const { Doctor } = require('../models/doctor');
const { Patient } = require('../models/patient');
const { verifyToken } = require('../middlewares/verifyToken');
const { sendEmail } = require('../helpers/sendEmail');
const { isValidObjectId } = require('mongoose');


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

router.post('/', upload.any('image'), async (req, res) => {
/*   console.log("req.body",req.body) */
  try {
    let obj = req.body;
    let doctor = new Doctor(obj);
/* console.log(11,doctor) */
doctor.account_state_dossier_affectation=false
doctor.liste_dossier= [{
  id:"",
  status:false,
  lengthTab:0,
  dataForms:[],
  valLenght:false,
  checkedone:false
}]
/* console.log(1321,doctor) */
    let findEmailInDoctor = await Doctor.findOne({ email: doctor.email })
    let findEmailInPatient = await Patient.findOne({ email: doctor.email })


    if (!findEmailInDoctor && !findEmailInPatient) {

      try {
        const salt = bcrypt.genSaltSync(10);
        // now we set user password to hashed password
        doctor.password = bcrypt.hashSync(doctor.password, salt);

      /*   filename1[0] ? doctor.photo = filename1[0] : doctor.photo = 'default.png'; */
        doctor.photo==undefined ? doctor.photo = 'default.png' : doctor.photo=doctor.photo;
        doctor.account_state = true;
        doctor.archived = false;
        doctor.added_date = new Date();


        let saveddoctor = await doctor.save()
        filename1 = []

        if (!saveddoctor) {
          return res.status(404).send('not found')
        } else {
          return res.status(200).send(saveddoctor);
        }
      } catch (error) {
        return res.status(400).send({ message: "Erreur", error });
      }


    } else {
      return res.status(404).send('email invalid')
    }


  } catch (error) {
    return res.status(400).send({ message: "Erreur", error });
  }
});

router.post('/login', async (req, res) => {
/*   console.log(2) */
  try {
    let doctorData = req.body

    let doctor = await Doctor.findOne({ email: doctorData.email, archived: false })
    if (!doctor) {
      res.status(404).send('not found')
    }
    else if (!doctor.account_state) {
      res.status(404).send('Compte blocké')
    }
    else {
      const validPassword = bcrypt.compareSync(doctorData.password, doctor.password);
      if (!validPassword) {
        res.status(401).send('Invalid Password')
      } else {
        let payload = { subject: doctor }
        let token = jwt.sign(payload, 'secretKey')
        res.status(200).send({ token })
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Erreur", error });
  }
})

router.get('/:id', verifyToken, async (req, res) => {
/*   console.log(3) */
  try {
    let id = req.params.id;
    if (!isValidObjectId(id)) {
      return res.status(404).send('not found')
    }
    let doctor = await Doctor.findOne({ _id: id, archived: false })

    if (!doctor) {
      res.status(404).send('not found')
    } else {
      res.status(200).send(doctor);
    }
  } catch (error) {
    res.status(400).send({ message: "Erreur", error });
  }
});

router.put('/updatephoto/:id', upload.any('image'), async (req, res) => {
 /*   console.log(4,req.body.image)  */
  try {
    let id = req.params.id;

    let updated = await Doctor.findByIdAndUpdate({ _id: id }, { $set: { photo: req.body.image } })

    if (!updated) {
      res.status(404).send('Admin not found')
    } else {
      filename1 = [];
      res.status(200).send(updated);
    }

  } catch (error) {
    res.status(400).send({ message: "Erreur", error });
  }


});

router.get('/', verifyToken, async (req, res) => {
/*   console.log(5) */
  try {
    let doctors = await Doctor.find({ archived: false })
    res.status(200).send(doctors);
  } catch (error) {
    res.status(400).send({ message: "Erreur", error });
  }
});


router.get('/getbygender/:genre', verifyToken, async (req, res) => {
/*   console.log(6) */
  try {

    let genre = req.params.genre;

    let doctors = await Doctor.find({ archived: false, gender: genre })
    res.status(200).send(doctors);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Erreur", error });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  /* console.log(7) */
  try {
    let id = req.params.id;
    let data = req.body
/* console.log("data.password",data.password) */
    data.password ? data.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10)) : delete data.password
 /*    console.log("data.password11",data.password) */
    let updateddoctor = await Doctor.findByIdAndUpdate({ _id: id }, data, { new: true })

    if (!updateddoctor) {
      res.status(404).send('not found')
    } else {
      let payload = { subject: updateddoctor }
      let token = jwt.sign(payload, 'secretKey')
      res.status(200).send({ token,updateddoctor });
    }

  } catch (error) {
    res.status(400).send({ message: "Erreur", error });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
/*   console.log(8) */
  try {
    let id = req.params.id;

    let doctor = await Doctor.findByIdAndDelete({ _id: id })

    if (!doctor) {
      res.status(404).send('not found')
    } else {
      res.status(200).send(doctor);
    }
  } catch (error) {
    res.status(400).send({ message: "Erreur", error });
  }
});

router.get('/archived/:id', verifyToken, async (req, res) => {
/*   console.log(9) */
  try {
    let id = req.params.id;

    let updatedForms = await Doctor.findByIdAndUpdate({ _id: id }, { $set: { archived: true } })

    if (!updatedForms) {
      res.status(404).send('not found')
    } else {
      res.status(200).send(updatedForms);
    }

  } catch (error) {
    res.status(400).send({ message: "Erreur", error });
  }
});

router.get('/restorer/:id', verifyToken, async (req, res) => {
/*   console.log(10) */
  try {
    let id = req.params.id;

    let updatedForms = await Doctor.findByIdAndUpdate({ _id: id }, { $set: { archived: false } })

    if (!updatedForms) {
      res.status(404).send('not found')
    } else {
      res.status(200).send(updatedForms);
    }

  } catch (error) {
    res.status(400).send({ message: "Erreur", error });
  }
});

router.get('/archive/getdoctorfromarchive', verifyToken, async (req, res) => {
 /*  console.log(11) */
  try {
    let doctors = await Doctor.find({ archived: true })
    res.status(200).send(doctors);
  } catch (error) {
    res.status(400).send({ message: "Erreur", error });
  }
});

router.put('/lockunlock/:id', verifyToken, async (req, res) => {
  /* console.log(12) */

  try {
    let id = req.params.id;
    let lock = req.body;

    let updatedForms = await Doctor.findByIdAndUpdate({ _id: id }, { $set: { account_state: lock.lock } })

    if (!updatedForms) {
      res.status(404).send('not found')
    } else {
      res.status(200).send(updatedForms);
    }
  } catch (error) {
    res.status(400).send({ message: "Erreur", error });
  }
});

router.get('/reset-password/:id/:token', async (req, res, next) => {
/*   console.log(13) */
  try {
    const { id, token } = req.params;

    let user = await Doctor.findOne({ _id: id })

    if (!user) {
      res.status(404).send('not found')
    } else {
      const secret = JWT_SECRET + user.password;
      const payload = jwt.verify(token, secret);
      res.status(200).send({ etat: "success" });
    }

  } catch (error) {
    res.status(400).send({ message: "Erreur", error });
  }
});

router.post('/reset-password/:id/:token', async (req, res, next) => {
  try {
    const { id, token } = req.params;

    let { password } = req.body;

    let user = await Doctor.findOne({ _id: id })

    if (!user) {
      res.status(404).send('not found')
    } else {
      const secret = JWT_SECRET + user.password;

      const payload = jwt.verify(token, secret);
      const salt = bcrypt.genSaltSync(10);
      // now we set user password to hashed password
      password = bcrypt.hashSync(password, salt);

      await Doctor.findByIdAndUpdate({ _id: id }, { password: password })

      res.status(200).send('success');
    }
  } catch (error) {
    res.status(400).send({ message: "Erreur", error });
  }

});

router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body;
    let doctor = await Doctor.findOne({ email: email });
    if (!doctor) {
      res.status(404).send('Patient not found')
    } else {
      if (doctor) {
        let password = Math.random().toString(36).substring(2, 12);
        const salt = bcrypt.genSaltSync(10);
        let hashedPassword = bcrypt.hashSync(password, salt)
        let savedDoctor = await Doctor.findByIdAndUpdate({ _id: doctor._id }, { password: hashedPassword })
        sendEmail(savedDoctor.email, password)
        return res.status(200).send({ etat: 'success' });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: "Erreur", error });
  }
})

module.exports = router;