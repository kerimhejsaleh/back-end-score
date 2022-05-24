const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
global.atob = require("atob");
global.Blob = require('node-blob');
const router = express.Router();

const { Admin } = require('../models/admin');
const { verifyAdminToken, getUserData } = require('../middlewares/verifyToken');
const { sendEmailLink } = require('../helpers/sendEmail');
const { isValidObjectId } = require('mongoose');

let filename1 = [];
///secret key
const JWT_SECRET = "htkspp678H5LLM09876BVG34HJ";

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
    let admin = new Admin(obj);

    let adminFromDb = await Admin.findOne({ email: obj.email })
    if (adminFromDb) {
      return res.status(400).send({ message: "Email already exists" })
    }

    const salt = bcrypt.genSaltSync(10);
    // now we set user password to hashed password
    admin.password = bcrypt.hashSync(admin.password, salt);
    admin.photo = filename1[0];
    admin.account_state = true;
    admin.archived = false;
    admin.added_date = new Date();

    let savedadmin = await admin.save()

    res.status(201).send(savedadmin);

  } catch (error) {
    res.status(400).send({ message: "Erreur", error });
  }

});

router.post('/login', async (req, res) => {
 /*  console.log('usee',await Admin.find()) */
  try {
    let adminData = req.body

    let admin = await Admin.findOne({ email: adminData.email })

    if (!admin) {
      return res.status(404).send('Invalid Email')
    } else {

      const validPassword = bcrypt.compareSync(adminData.password, admin.password);

      if (!validPassword) {
        res.status(404).send('Invalid Password')
      } else {
        let payload = { subject: admin }
        let token = jwt.sign(payload, 'secretKey')
        return res.status(200).send({ token })
      }
    }

  } catch (error) {
    res.status(400).send({ message: "Erreur", error });
  }

})

router.get('/:id', verifyAdminToken, async (req, res) => {

  try {
    let id = req.params.id;

    if (!isValidObjectId(id)) {
      return res.status(404).send('not found')
    }

    let admin = await Admin.findOne({ _id: id })

    if (!admin) {
      res.status(404).send('Admin not found')
    } else {
      res.send(admin);
    }

  } catch (error) {
    res.status(400).send({ message: "Erreur", error });
  }

});

router.put('/updatephoto/:id', upload.any('image'), async (req, res) => {

  try {
    let id = req.params.id;

    let updated = await Admin.findByIdAndUpdate({ _id: id }, { $set: { photo: filename1[0] } })

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

router.put('/:id', verifyAdminToken, async (req, res) => {

  try {
    let id = req.params.id;
    let data = req.body

    let updated = await Admin
      .findByIdAndUpdate({ _id: id }, {
        $set: {
          name: data.name,
          lastname: data.lastname,
          email: data.email,
        }
      })

    if (!updated) {
      res.status(404).send('Admin not found')
    } else {
      let payload = { subject: updated }
      let token = jwt.sign(payload, 'secretKey')
      res.status(200).send({ token })
    }

  } catch (error) {
    res.status(400).send({ message: "Erreur", error });
  }

});

router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body;
    let admin = await Admin.findOne({ email: email });
    if (!admin) {
      return res.status(404).send('Patient not found')
    } else {
      const secret = JWT_SECRET + admin.password;
      const payload = {
        email: admin.email,
        _id: admin._id
      }
      const token = jwt.sign(payload, secret, { expiresIn: "15min" });
 /*      console.log("eeeeeeeeeeeeeeeeeeeeeeee",`http://localhost:4200/resetpassword/${admin._id}/${token}`) */
      const link = `http://185.104.172.119:3000/#/resetpassword/${admin._id}/${token}`;
  /*     console.log("linnkk",link) */
      sendEmailLink(admin.email, link)
      res.status(200).send({ etat: token });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Erreur", error });
  }
})

router.get('/reset-password/:id/:token', async (req, res, next) => {
  try {
    const { id, token } = req.params;

    let admin = await Admin.findOne({ _id: id })

    if (!admin) {
      res.status(404).send('Admin not found')
    } else {
      const secret = JWT_SECRET + admin.password;
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

    let admin = await Admin.findOne({ _id: id })

    if (!admin) {
      res.status(404).send('Admin not found')
    } else {
      const secret = JWT_SECRET + admin.password;

      const payload = jwt.verify(token, secret);
      const salt = bcrypt.genSaltSync(10);
      // now we set user password to hashed password
      password = bcrypt.hashSync(password, salt);
      let updated = await Admin.findByIdAndUpdate({ _id: id }, { password: password })

      if (!updated) {
        res.status(404).send('Admin not found')
      } else {
        res.status(200).send('success');
      }

    }

  } catch (error) {
    res.status(400).send({ message: "Erreur", error });
  }

});

router.post('/tokenverification', async (req, res) => {

  let token = req.body.token;
/*   console.log("tpken",req.body) */
/*   console.log(token); */
  if (!token) {
  /*   console.log("2222");  */
    return res.status(401).send('Unauthorized request')
  }
  let userData = getUserData(token);
/*   console.log("22223333",userData);  */
  if (userData) {
    let admin = await Admin.findOne({ _id: userData._id });
/*     console.log("admin",admin); */
    if (!admin) {
 /*      console.log('3333333'); */
      return res.status(401).send('Unauthorized request')
    } else {
      return res.json({ status: 200 });
    }
  } else {
    return res.status(401).send('Unauthorized request')
  }



});



module.exports = router;