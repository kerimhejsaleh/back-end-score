const express = require('express');
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const router = express.Router();
router.post("/", upload.single("image"), async (req, res) => {
  /*   console.log("hhhh",req.body) */
  try {
    /* console.log("hhhh",req.body)  */
    const result = await cloudinary.uploader.upload(req.body.image);
    cloudinary.video("dog", {controls:true, transformation: [
        {width: 0.4, angle: 20},
        {overlay: "cloudinary_icon_white", width: 60, opacity: 50, gravity: "south_east", y: 15, x: 60}
        ]})
   res.json(result.secure_url)
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;