const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
global.atob = require("atob");
global.Blob = require('node-blob');
const { Patient } = require('../models/patient');
const { Doctor } = require('../models/doctor');
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
  try {
    let obj = req.body;
    let patient = new Patient(obj);


    let findEmailInDoctor = await Doctor.findOne({ email: patient.email })
    let findEmailInPatient = await Patient.findOne({ email: patient.email })


    if (!findEmailInDoctor && !findEmailInPatient) {

      try {
        const salt = bcrypt.genSaltSync(10);
        // now we set user password to hashed password
        patient.password = bcrypt.hashSync(patient.password, salt);

        filename1[0] ? patient.photo = filename1[0] : patient.photo = 'default.png';
        patient.account_state = true;
        patient.archived = false;
        patient.added_date = new Date();


        let savedpatient = await patient.save()
        filename1 = []

        if (!savedpatient) {
          res.status(404).send('not found')
        } else {
          res.status(200).send(savedpatient);
        }
      } catch (error) {
        console.log(error);
        res.status(400).send({ message: "Erreur", error });
      }


    } else {
      res.status(404).send('email invalid')
    }


  } catch (error) {
    res.status(400).send({ message: "Erreur", error });
  }
});



router.post('/login', async (req, res) => {
  try {
    let patientData = req.body

    let patient = await Patient.findOne({ email: patientData.email })

    if (!patient) {
      res.status(401).send('Invalid Email')
    }
    else if (!patient.account_state) {
      res.status(404).send('Compte blocké')
    }
    else {
      const validPassword = bcrypt.compareSync(patientData.password, patient.password);
      if (!validPassword) {
        res.status(401).send('Invalid Password')
      } else {
        let payload = { subject: patient }
        let token = jwt.sign(payload, 'secretKey')
        res.status(200).send({ token })
      }
    }

  } catch (error) {
    res.status(400).send({ message: "Erreur", error });
  }
})

router.get('/:id', verifyToken, async (req, res) => {
  try {
    let id = req.params.id;
    if (!isValidObjectId(id)) {
      return res.status(404).send('not found')
    }
    let patient = await Patient.findOne({ _id: id, archived: false })
    if (!patient) {
      return res.status(404).send({ message: "Not found" })
    }
    else {
      res.status(200).send(patient);
    }
  } catch (error) {
    res.status(400).send({ message: "Erreur", error });
  }
});




router.get('/', verifyToken, async (req, res) => {
  try {
    let patients = await Patient.find({ archived: false })
    res.status(200).send(patients);
  } catch (error) {
    res.status(400).send({ message: "Erreur", error });
  }
});

router.get('/getbygender/:genre', verifyToken, async (req, res) => {
  try {

    let genre = req.params.genre;

    let patients = await Patient.find({ archived: false, gender: genre })
    res.status(200).send(patients);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Erreur", error });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  console.log("req.body",req.body)
  try {
    let id = req.params.id;
    let data = req.body

    data.password ? data.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10)) : delete data.password

    let updatedpatient = await Patient.findByIdAndUpdate({ _id: id }, data, { new: true })

    if (!updatedpatient) {
      return res.status(404).send({ message: "Not found" })
    } else {
      let payload = { subject: updatedpatient }
      let token = jwt.sign(payload, 'secretKey')
      return res.status(200).send({ token });
    }

  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Erreur", error });
  }
});


router.put('/updatephoto/:id', upload.any('image'), async (req, res) => {

  try {
    let id = req.params.id;

    let updated = await Patient.findByIdAndUpdate({ _id: id }, { $set: { photo: filename1[0] } })

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


router.delete('/:id', verifyToken, async (req, res) => {
  try {
    let id = req.params.id;

    let patient = await Patient.findByIdAndDelete({ _id: id })
    if (!patient) {
      res.status(404).send({ message: "Not found" })
    }
    else {
      res.status(200).send(patient);
    }
  } catch (error) {
    res.status(400).send({ message: "Erreur", error });
  }
});

router.get('/archived/:id', verifyToken, async (req, res) => {
  try {
    let id = req.params.id;

    let updatedForms = await Patient.findByIdAndUpdate({ _id: id }, { $set: { archived: true } })

    if (!updatedForms) {
      res.status(404).send({ message: "Not found" })
    }
    else {
      res.status(200).send(updatedForms);
    }

  } catch (error) {
    res.status(400).send({ message: "Erreur", error });
  }
});

router.get('/restorer/:id', verifyToken, async (req, res) => {
  try {
    let id = req.params.id;

    let updatedForms = await Patient.findByIdAndUpdate({ _id: id }, { $set: { archived: false } })

    if (!updatedForms) {
      res.status(404).send({ message: "Not found" })
    } else {
      res.status(200).send(updatedForms);
    }

  } catch (error) {
    res.status(400).send({ message: "Erreur", error });
  }
});

router.get('/archive/getpatientfromarchive', verifyToken, async (req, res) => {
  try {
    let patients = await Patient.find({ archived: true })
    res.status(200).send(patients);
  } catch (error) {
    res.status(400).send({ message: "Erreur", error });
  }
});

router.put('/lockunlock/:id', verifyToken, async (req, res) => {
  try {
    let id = req.params.id;
    let lock = req.body;

    let updatedForms = await Patient
      .findByIdAndUpdate({ _id: id }, { $set: { account_state: lock.lock } })
    if (!updatedForms) {
      res.status(404).send({ message: "Not found" })
    } else {
      res.status(200).send(updatedForms);
    }
  } catch (error) {
    res.status(400).send({ message: "Erreur", error });
  }
});



router.get('/reset-password/:id/:token', async (req, res, next) => {
  try {
    const { id, token } = req.params;

    let user = await Patient.findOne({ _id: id })

    if (!user) {
      res.status(404).send('invalid');
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

    let user = await Patient.findOne({ _id: id })

    if (!user) {
      res.status(404).send('invalid');
    } else {
      const secret = JWT_SECRET + user.password;
      const payload = jwt.verify(token, secret);
      const salt = bcrypt.genSaltSync(10);
      // now we set user password to hashed password
      password = bcrypt.hashSync(password, salt);

      let patient = await Patient.findByIdAndUpdate({ _id: id }, { password: password })

      if (!patient) {
        res.status(404).send({ message: "Not found" });
      } else {
        res.status(200).send('success');
      }
    }

  } catch (error) {
    res.status(400).send({ message: "Erreur", error });
  }
});

router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body;
    let patient = await Patient.findOne({ email: email });
    if (!patient) {
      res.status(404).send('Patient not found')
    } else {
      if (patient) {
        let password = Math.random().toString(36).substring(2, 12);
        const salt = bcrypt.genSaltSync(10);
        let hashedPassword = bcrypt.hashSync(password, salt)
        let savedPatient = await Patient.findByIdAndUpdate({ _id: patient._id }, { password: hashedPassword })
        sendEmail(savedPatient.email, password)
        res.status(200).send({ etat: 'success' });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Erreur", error });
  }
})

module.exports = router;