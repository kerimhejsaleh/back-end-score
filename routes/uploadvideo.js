const express = require('express');
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const User = require("../models/uploadVideo");
const router = express.Router();
multer  = require('multer');
//...

router.post("/audio", async (req, res) => {
    // Get the file name and extension with multer
    const storage = multer.diskStorage({
      filename: (req, file, cb) => {
        const fileExt = file.originalname.split(".").pop();
        const filename = `${new Date().getTime()}.${fileExt}`;
        cb(null, filename);
      },
    });
  
    // Filter the file to validate if it meets the required audio extension
    const fileFilter = (req, file, cb) => {
      if (file.mimetype === "audio/mp3" || file.mimetype === "audio/mpeg") {
        cb(null, true);
      } else {
        cb(
          {
            message: "Unsupported File Format",
          },
          false
        );
      }
    };
  
    // Set the storage, file filter and file size with multer
    const upload = multer({
      storage,
      limits: {
        fieldNameSize: 200,
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter,
    }).single("audio");
  
    // upload to cloudinary
    upload(req, res, (err) => {
      if (err) {
        return res.send(err);
      }
  
      // SEND FILE TO CLOUDINARY
      cloudinary.config({
        cloud_name: "med-in-outlook",
        api_key: "323351562377729",
        api_secret: "rmpRc5eCkoYDKqsI0BcBXL8IUhA",
      });
      const { path } = req.file; // file becomes available in req at this point
  
      const fName = req.file.originalname.split(".")[0];
      cloudinary.uploader.upload(
        path,
        {
          resource_type: "raw",
          public_id: `AudioUploads/${fName}`,
        },
  
        // Send cloudinary response or catch error
        (err, audio) => {
          if (err) return res.send(err);
  
          fs.unlinkSync(path);
          res.send(audio);
        }
      );
    });
  });
  
  //...
  
router.post("/", upload.single("image"), async (req, res) => {
    console.log("hhhh",req.file.path)
  try {
    
    const result = await cloudinary.uploader.upload(req.file.path);
    cloudinary.video("dog", {controls:true, transformation: [
        {width: 0.4, angle: 20},
        {overlay: "cloudinary_icon_white", width: 60, opacity: 50, gravity: "south_east", y: 15, x: 60}
        ]})
    console.log(result);
  
    let user = new User({
      name: req.body.name,
      avatar: result.secure_url,
      cloudinary_id: result.public_id,
    }); 

    
   await user.save();
   
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
  }
});

router.get("/", async (req, res) => {
  try {
    let user = await User.find();
    res.json(user);
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    // Find user by id
    let user = await User.findById(req.params.id);
    // Delete image from cloudinary
    await cloudinary.uploader.destroy(user.cloudinary_id);
    // Delete user from db
    await user.remove();
    res.json(user);
  } catch (err) {
    console.log(err);
  }
});

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    // Delete image from cloudinary
    await cloudinary.uploader.destroy(user.cloudinary_id);
    // Upload image to cloudinary
    let result;
    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path);
    }
    const data = {
      name: req.body.name || user.name,
      avatar: user.avatar,
      cloudinary_id:  user.cloudinary_id,
    };
    user = await User.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(user);
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    // Find user by id
    let user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;