const express = require('express');
const router = express.Router();
const { Doctor } = require('../models/doctor');
const { Achat } = require('../models/achat');
const  Achat2  = require('../models/achat');
router.get("/:id", async (req, res) => {
    try {
        obj = req.params.id;
        let doctor = await Achat.find({ user: obj })
      res.status(200).send({doctor :doctor});
    } catch (err) {
      console.log(err);
    }
  });
  router.get("/", async (req, res) => {
    try {
        obj = req.params.id;
        let achat = await Achat.find()
      res.status(200).send({achat :achat});
    } catch (err) {
      console.log(err);
    }
  });
function addMonths(numOfMonths, date = new Date()) {
  date.setMonth(date.getMonth() + numOfMonths);
  
  return date;
}
router.post('/addachat', async (req, res) => {
 console.log("1")
    try {
      console.log("2")

        obj = req.body;
        console.log("obj",obj)
        let doctor = await Doctor.findOne({ _id: obj.user })
        let achatForm = await Achat.findOne({ user: obj.user })
 /*       console.log("achatForm",achatForm)  */
 const result = addMonths(2);

// 👇️ Add months to another date
/* const date = new Date();
const dateMonth =addMonths(1, date)
const dateYear =addMonths(12, date) */
         if (!doctor) {
          console.log("3")

            return res.status(404).send({ message: "Not found" })
        }
         if(achatForm==null) {
          console.log("4",obj.type)
          if(obj.type){
          let achat = new Achat({
            user:obj.user,
            datedefin:addMonths(1, new Date()),
            datedebut:new Date(),
            type:obj.type
    
          }); 
          await achat.save()
          console.log("5")

          return res.status(200).send({ result: true })
         }else{
          let achat = new Achat({
            user:obj.user,
            datedefin:addMonths(12, new Date()),
            datedebut:new Date(),
            type:obj.type
    
          }); 
          await achat.save()
          console.log("6")

          return res.status(200).send({ result: true })
         }
                  
          
         }else{
          console.log("7")

       if(achatForm.type && obj.type){
        console.log("8")

            if(new Date()<achatForm.datedefin){
              console.log("9")

              return res.status(200).send({result :"déja payé"});
            }else{
              console.log("10")

              achaUpdate = await Achat.findByIdAndUpdate({ _id: achatForm._id }, { $set: {  datedefin: addMonths(1, new Date()),
                datedebut: new Date(),
           
              } });
              console.log("11")

                return res.status(200).send({result :achaUpdate});
            }
          }
          if(!achatForm.type && !obj.type){
            console.log("12")

            if(new Date()<achatForm.datedefin){
              console.log("13")

              return res.status(200).send({result :"déja payé"});
            }else{
              console.log("14")

              achaUpdate = await Achat.findByIdAndUpdate({ _id: achatForm._id }, { $set: {  datedefin: addMonths(12, new Date()),
                datedebut: new Date(),
             
              } });
                return res.status(200).send({result :achaUpdate});
            }
          }
          if(achatForm.type && !obj.type){
            console.log("15")

            if(new Date()<achatForm.datedefin){
              console.log("16")

              return res.status(200).send({result :"déja payé"});
            }else{
              console.log("17")

              achaUpdate = await Achat.findByIdAndUpdate({ _id: achatForm._id }, { $set: {  datedefin: addMonths(12, new Date()),
                datedebut: new Date(),
                type:obj.type
              } });
                return res.status(200).send({result :achaUpdate});
            }
          }
          if(!achatForm.type && obj.type){
            console.log("18")

            if(new Date()<achatForm.datedefin){
              console.log("19")

              return res.status(200).send({result :"déja payé"});
            }else{
              console.log("20")

              achaUpdate = await Achat.findByIdAndUpdate({ _id: achatForm._id }, { $set: {  datedefin: addMonths(1, new Date()),
                datedebut: new Date(),
                type:obj.type
              } });
                return res.status(200).send({result :achaUpdate});
            }
          } 
     /*     console.log("2")  
          if(obj.type){
           console.log("3")  
            return res.status(200).send({achaUpdate :true});
          } else
          {
            console.log("4",new Date()>achatForm.datedefin) 
            if(new Date()<achatForm.datedefin){
              return res.status(200).send({result :"c déja paye"});
            }else{
              achaUpdate = await Achat.findByIdAndUpdate({ _id: achatForm._id }, { $set: {  datedefin: obj.datedefin,
                datedebut: obj.datedebut,
                type:obj.type
              } });
                return res.status(200).send({result :achaUpdate});
            }
         
          } */
         }
       
     /*    let doctor = await Doctor.findOne({ _id: obj.user })
        let achatForm = await Achat.findOne({ user: obj.user })
       console.log("achatForm",achatForm) 
         if (!doctor) {
            return res.status(404).send({ message: "Not found" })
        }
         if(achatForm==null) {
            
            let achat = new Achat(obj);           
            await achat.save()
            return res.status(200).send({ achat: true })
         }
         if(achatForm!=null){

            achaUpdate = await Achat.findByIdAndUpdate({ _id: achatForm._id }, { $set: {  datedefin: obj.datedefin,
                datedebut: obj.datedebut,
              } });
                return res.status(200).send({achaUpdate :achaUpdate});
         } */

       
    } catch (error) {
      console.log("21")

        res.status(400).send({ message: "Erreur", error });
    }
});
router.post('/addachatan', async (req, res) => {
    try {
        obj = req.body;
        let doctor = await Doctor.findOne({ _id: obj.user, type:true  })
        let achatForm = await Achat.findOne({ user: obj.user })
        /* console.log("achatForm",achatForm) */
         if (!doctor) {
            return res.status(404).send({ message: "Not found" })
        }
         if(achatForm==null) {
            
            let achat = new Achat(obj);           
            await achat.save()
            return res.status(200).send({ achat: true })
         }
         if(achatForm!=null){
     /*        console.log("hii") */
            achaUpdate = await Achat.findByIdAndUpdate({ _id: achatForm._id }, { $set: {  datedefin: obj.datedefin,
                datedebut: obj.datedebut,
              } });
                return res.status(200).send({achaUpdate :achaUpdate});
         }


    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
    }
});
  module.exports = router;