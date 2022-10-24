const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const { Inside } = require('../models/inside');
const { verifyAdminToken } = require('../middlewares/verifyToken');
const { Forms } = require('../models/forms');
const { Dossier } = require('../models/dossier');

const router = express.Router();

router.post('/addinside', verifyAdminToken, async (req, res) => {
  /*   console.log("req.body",req.body) */
    try {
        obj = req.body;
        let form = await Forms.findOne({ _id: obj.form, archived: false });
      //  console.log("form",form.nameAff)
      //  console.log(" obj.nameDossier", obj.nameDossier)
        let updatedForm = await Forms.findByIdAndUpdate({ _id: obj.form, archived: false }, {
            $set: {
                nameAff : obj.nameDossier,
                nameAff2: obj.nameDossier,
                etat :true
            }
        })
  //  console.log("updatedForm",updatedForm.nameAff)  
        let dossier = await Dossier.findOne({ _id: obj.dossier, archived: false });
        if (!form || !dossier) {
            return res.status(404).send({ message: "Not found" })
        }
        let inside = new Inside(obj);
        inside.date = new Date();

        let aff = await Inside.findOne({ dossier: obj.dossier, form: obj.form })
     /*    console.log("aff",aff) */
        if (!aff) {
            await inside.save()
            res.status(200).send({ affected: 1 })
        } else {
            res.status(200).send({ affected: 0 });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: "Erreur", error });
    }
});
router.post('/addinsideDossier', verifyAdminToken, async (req, res) => {
    /*  console.log("req.body",req.body)  */
      try {
          obj = req.body;
          let form = await Forms.findOne({ _id: obj.form, archived: false });
       /*   console.log("form",form) */
        //  console.log(" obj.nameDossier", obj.nameDossier)
          let updatedForm = await Forms.findByIdAndUpdate({ _id: obj.form, archived: false }, {
              $set: {
                
                  dossierAff: obj.nameDossier,
                  etat :true
              }
          })
  /*  console.log("updatedForm",updatedForm)   */
          let dossier = await Dossier.findOne({ _id: obj.dossier, archived: false });
          if (!form || !dossier) {
              return res.status(404).send({ message: "Not found" })
          }
          let inside = new Inside(obj);
          inside.date = new Date();
  
          let aff = await Inside.findOne({ dossier: obj.dossier, form: obj.form })
          /* console.log("aff",aff)  */
          if (!aff) {
              await inside.save()
              res.status(200).send({ affected: 1 })
          } else {
              res.status(200).send({ affected: 0 });
          }
      } catch (error) {
          console.log(error);
          res.status(400).send({ message: "Erreur", error });
      }
  });
router.get('/getinside/:dossier', verifyAdminToken, async (req, res) => {
    try {
        let dossier = await Dossier.findOne({ _id: req.params.dossier, archived: false });
        if (!dossier) {
            return res.status(404).send({ message: "Not found" })
        }
        let insides = await Inside.find({ dossier: req.params.dossier })
        res.status(200).send(insides);
    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
    }
});





router.get('/getmyform/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const ObjectId = mongoose.Types.ObjectId;

        let dossier = await Dossier.findOne({ _id: id, archived: false });
        if (!dossier) {
            return res.status(404).send({ message: "Not found" })
        }

        let insides = await Inside
            .aggregate(
                [
                    {
                        $match: {
                            dossier: ObjectId(id)
                        }
                    },
                    {
                        $lookup: {
                            from: "forms",
                            localField: "form",
                            foreignField: "_id",
                            as: 'forms'
                        }
                    },
                    { "$sort": { "title": 1 } }
                ]
            )
        let forms = [];
        for (let i = 0; i < insides.length; i++) {
            if (insides[i].forms[0] && !insides[i].forms[0].archived) {
                forms.push(insides[i].forms[0]);
            }
        }
        res.status(200).send(forms)
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: "Erreur", error });
    }

});
router.delete('/deleteinside/:dossier/:form/:type', verifyAdminToken, async (req, res) => {
/* console.log("req.params.",req.params.type) */
    try {
        let form = await Forms.findOne({ _id: req.params.form, archived: false });
 
        let dossier = await Dossier.findOne({ _id: req.params.dossier, archived: false });
        if (!form || !dossier) {
  
            return res.status(404).send({ message: "Not found" })
        }
     //  console.log("form",forms)  
    //   console.log("dossier",dossier)  
        let deletedinside = await Inside.findOneAndDelete({ dossier: req.params.dossier, form: req.params.form})
     /*    console.log("form.nameAff.length",form.nameAff.length,form.nameAff2.length)   */
        if(form.nameAff.length==1&&form.nameAff2.length==1 ||req.params.type=="aucun" ||req.params.type=="aucun"&& form.nameAff.length>1&&form.nameAff2.length>1){
          /*   console.log(1) */
    /*         console.log("form.nameAff.lengtzzzzzh",form.nameAff.length,form.nameAff2.length)   */
        let updatedForm = await Forms.findByIdAndUpdate({ _id: req.params.form, archived: false }, {
            $set: {
                nameAff : [{Aff1:"Aucune dossier",checked:false}],
                nameAff2 :[{Aff1:"Aucune dossier",checked:false}],
                dossierAff:[{nameDossier:"Aucune dossier",id:""}],
                etat :false
            }

        })
      /*   console.log("updatedForm,updatedForm",updatedForm) */}else{
        /*     console.log(2) */
            let i=0;
            form.nameAff.map((resMap)=>{
            // console.log("res",res.name,resMap.Aff1)
              i++;
               if(resMap.Aff1==dossier.name){
               //  console.log(i,resForm.nameAff)
               form.nameAff.splice(i-1,i)
               form.nameAff2.splice(i-1,i)
            /*    console.log("dddddddd",i,form.nameAff) */
               }
            })
            let updatedForm = await Forms.findByIdAndUpdate({ _id: req.params.form, archived: false }, {
                $set: {
                    nameAff : form.nameAff,
                    nameAff2 :form.nameAff2,
                    etat :false
                }
            })
         /*    console.log("updatedForm2",updatedForm) */
        }
      /*  console.log("yyreeey",updatedForm) */
        if (!deletedinside) {
         /*    console.log("yyyggggg")  */
            res.status(404).send('not found')
        } else {
            
     /*      console.log("yzzzzyy")  */
            res.status(200).send(deletedinside);
        }

    } catch (error) {
        console.log(error);
        res.status(400).send({ message: "Erreur", error });
    }

});
 

module.exports = router;