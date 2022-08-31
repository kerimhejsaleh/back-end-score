const express = require('express');
const jwt = require('jsonwebtoken');

const { Affect } = require('../models/affect');
const { Response } = require('../models/response');
const { Forms } = require('../models/forms');
const { Patient } = require('../models/patient');
const { Doctor } = require('../models/doctor');
const { verifyToken } = require('../middlewares/verifyToken');


const router = express.Router();

router.post('/addresponse', async (req, res) => {
    try {
        let obj = req.body;
        console.log( "jj",obj)
        let patient = await Patient.findOne({ _id: obj.user, archived: false })
        let doctor = await Doctor.findOne({ _id: obj.doctor, archived: false })
        let formFromDb = await Forms.findOne({ _id: obj.form, archived: false })

        if (!patient || !doctor || !formFromDb) {
            return res.status(404).send({ message: "Not found" })
        }
        let responsesFromDb = await Response.findOne({ doctor: obj.doctor, form: obj.form, user: obj.user })
        if (responsesFromDb) {
            return res.status(400).send({ message: "Patient already respond" })
        }

        let responses = new Response(obj);
        responses.form_title = formFromDb.title;
        responses.form_description = formFromDb.description;
        responses.form_created_date = formFromDb.created_date;
        responses.form_sections = formFromDb.sections;
        responses.form_messages = formFromDb.messages;
        responses.form_formule = formFromDb.formule;
        responses.form_archived = formFromDb.archived;
        responses.form_status = formFromDb.status;
        responses.form_genre = formFromDb.genre;
        responses.form_password = formFromDb.password;

        responses.created_date = new Date();
        responses.archived = false;
        let sc = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
               let form = await Forms.findOne({ _id: responses.form })
        let formule = form.formule;
         formuleMuti = form.formMuti;

        //------------------------------------------------
    // console.log(formuleMuti);

        if (form.formMuti != []) {
            //f = ((q1 + q2 + q3) * 3) / q4
           // formuleMuti = formuleMuti.toUpperCase();
            let nbr = '';
            let indexToReplace = 0;
            let formuleCalcule = 0;
            let formuleCalculeGlobal = [];
            formuleMuti.forEach(function(item,index) {
              //  console.log("item",item);
              formuleCalculeGlobal.push("");
            for (let i = 0; i < item.indexScoreForm.length; i++) {

                   if(item.indexScoreForm[i]["type"]=="index"){
                    if(item.indexScoreForm[i]['i'] == 0 ) { 
                        if(responses.responses[item.indexScoreForm[i]["j"]].type == "Cases à cocher"){
                            for (let j = 0; j < responses.responses[item.indexScoreForm[i]["j"]]["options"].length; j++) {
                                if(responses.responses[item.indexScoreForm[i]["j"]]["options"][j]["selected"]==true){
                                    formuleCalcule = formuleCalcule + responses.responses[item.indexScoreForm[i]["j"]]["options"][j]["score"];
                                    formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + `${responses.responses[item.indexScoreForm[i]["j"]]["options"][j]["score"]}`;
                                }
                            }
                            console.log("formule 2",formuleCalcule);
                        }
                        if(responses.responses[item.indexScoreForm[i]["j"]].type == "Choix multiples"){
                            for (let j = 0; j < responses.responses[item.indexScoreForm[i]["j"]]["optioncm"].length; j++) {
                                if(responses.responses[item.indexScoreForm[i]["j"]]["optioncm"][j]["selected"]==true){
                                    formuleCalcule = formuleCalcule + responses.responses[item.indexScoreForm[i]["j"]]["optioncm"][j]["score"];
                                    formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + `${responses.responses[item.indexScoreForm[i]["j"]]["optioncm"][j]["score"]}`;

                                }
                            }
                            console.log("formule 3",formuleCalcule); 
                        }
                        if(responses.responses[item.indexScoreForm[i]["j"]].type == "VISUELLE ANALOGIQUE"){
                            formuleCalcule = formuleCalcule + responses.responses[item.indexScoreForm[i]["j"]]["score"];
                            formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + `${responses.responses[item.indexScoreForm[i]["j"]]["score"]}`;

                            console.log("formule 4",formuleCalcule);
                        }
                        if(responses.responses[item.indexScoreForm[i]["j"]].type=="Range Bar"){
                            formuleCalcule = formuleCalcule + responses.responses[item.indexScoreForm[i]["j"]]["scoreOptionRangeBar"];
                            formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + `${responses.responses[item.indexScoreForm[i]["j"]]["scoreOptionRangeBar"]}`;

                            console.log("formule 5",formuleCalcule);
                        }
                        if(responses.responses[item.indexScoreForm[i]["j"]].type=="Nomber de jours"){
                            formuleCalcule = formuleCalcule + parseInt(responses.responses[item.indexScoreForm[i]["j"]]["minRange"]);
                            formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + `${parseInt(responses.responses[item.indexScoreForm[i]["j"]]["minRange"])}`;

                            console.log("formule 6",formuleCalcule);
                        }
                        if(responses.responses[item.indexScoreForm[i]["j"]].type=="Grille de cases à cocher"){
                            //console.log("dddddd", responses.responses[item.indexScoreForm[i]["j"]].optionsSaint);
                            for (let j = 0; j < responses.responses[item.indexScoreForm[i]["j"]].optionsSaint.length; j++) {
                                for (let k = 0; k < responses.responses[item.indexScoreForm[i]["j"]].optionsSaint[j].value.length; k++) {
                                    if(responses.responses[item.indexScoreForm[i]["j"]].optionsSaint[j].value[0][k]==true){
                                        formuleCalcule = formuleCalcule + 3;
                                        formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + "3";

    
                                    }
                                    if(responses.responses[item.indexScoreForm[i]["j"]].optionsSaint[j].value[1][k]==true){
                                        formuleCalcule = formuleCalcule + 2;
                                        formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + "2";

    
                                    }
                                    if(responses.responses[item.indexScoreForm[i]["j"]].optionsSaint[j].value[2][k]==true){
                                        formuleCalcule = formuleCalcule + 1;
                                        formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + "1";

    
                                    }
                                    if(responses.responses[item.indexScoreForm[i]["j"]].optionsSaint[j].value[3][k]==true){
                                        formuleCalcule = formuleCalcule + 0;
                                        formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + "0";

    
                                    }
                                }
                            }
                            console.log("formule 7",formuleCalcule);
                   }
                   
                   if(responses.responses[item.indexScoreForm[i]["j"]].type=="Grille de cases à cocher 2"){
                    for (let j = 0; j < responses.responses[item.indexScoreForm[i]["j"]].scoreOptioncm2.scoreS.length; j++) {
                        for (let k = 0; k < responses.responses[item.indexScoreForm[i]["j"]].scoreOptioncm2.scoreS[j].value.length; k++) {
                            if(responses.responses[item.indexScoreForm[i]["j"]].scoreOptioncm2.scoreS[j].value[k][j]==true){
                                console.log("score 2",responses.responses[item.indexScoreForm[i]["j"]].scoreOptioncm2.scoreS[j].score );
                                console.log("formule parcoure 2",formuleCalcule);
                                formuleCalcule = formuleCalcule + responses.responses[item.indexScoreForm[i]["j"]].scoreOptioncm2.scoreS[j].score;
                                formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + `${responses.responses[item.indexScoreForm[i]["j"]].scoreOptioncm2.scoreS[j].score}`;

                            }
                        }
                    }
                }
                } 
                   else if(item.indexScoreForm[i]['i'] <= 9 && item.indexScoreForm[i]['j'] <= 9 ) { 
                        if(responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)].type == "Cases à cocher"){
                            for (let j = 0; j < responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)]["options"].length; j++) {
                                if(responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)]["options"][j]["selected"]==true){
                                    formuleCalcule = formuleCalcule + responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)]["options"][j]["score"];
                                    formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + `${responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)]["options"][j]["score"]}`;

                                }
                            }
                            
                        }
                        if(responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)].type == "Choix multiples"){
                            for (let j = 0; j < responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)]["optioncm"].length; j++) {
                                if(responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)]["optioncm"][j]["selected"]==true){
                                    formuleCalcule = formuleCalcule + responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)]["optioncm"][j]["score"];
                                    formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + `${responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)]["optioncm"][j]["score"]}`;

                                }
                            }
                            
                        }
                        if(responses.responses[item.indexScoreForm[i]["j"]].type == "VISUELLE ANALOGIQUE"){
                            formuleCalcule = formuleCalcule + responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)]["score"];
                            formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + `${responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)]["score"]}`;

                            
                        }
                        if(responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)].type=="Range Bar"){
                            formuleCalcule = formuleCalcule + responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)]["scoreOptionRangeBar"];
                            formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + `${responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)]["scoreOptionRangeBar"]}`;

                            
                        }
                        if(responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)].type=="Nomber de jours"){
                            formuleCalcule = formuleCalcule + parseInt(responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)]["minRange"]);
                            formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + `${parseInt(responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)]["minRange"])}`;

                            
                        }
                        if(responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)].type=="Grille de cases à cocher"){
                            console.log("dddddd", responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)].optionsSaint);
                            for (let j = 0; j < responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)].optionsSaint.length; j++) {
                                for (let k = 0; k < responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)].optionsSaint[j].value.length; k++) {
                                    if(responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)].optionsSaint[j].value[0][k]==true){
                                        formuleCalcule = formuleCalcule + 3;
                                        formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + "3";

    
                                    }
                                    if(responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)].optionsSaint[j].value[1][k]==true){
                                        formuleCalcule = formuleCalcule + 2;
                                        formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + "2";

    
                                    }
                                    if(responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)].optionsSaint[j].value[2][k]==true){
                                        formuleCalcule = formuleCalcule + 1;
                                        formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + "1";

    
                                    }
                                    if(responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)].optionsSaint[j].value[3][k]==true){
                                        formuleCalcule = formuleCalcule + 0;
                                        formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + "0";

    
                                    }
                                }
                            }
                   }
                   if(responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)].type=="Grille de cases à cocher 2"){
                    for (let j = 0; j < responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)].scoreOptioncm2.scoreS.length; j++) {
                        for (let k = 0; k < responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)].scoreOptioncm2.scoreS[j].value.length; k++) {
                            if(responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)].scoreOptioncm2.scoreS[j].value[k][j]==true){
                                console.log("score 2",responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)].scoreOptioncm2.scoreS[j].score );
                                console.log("formule parcoure 2",formuleCalcule);
                                formuleCalcule = formuleCalcule + responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)].scoreOptioncm2.scoreS[j].score;
                                formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + `${responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)].scoreOptioncm2.scoreS[j].score}`;

                            }
                        }
                    }
                }
                        
                   } 
                    
                   }
                   else if(item.indexScoreForm[i]["type"]=="operation"){
                       if(item.indexScoreForm[i]["desc"] == "+"){
                        formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + "+";
                       }else if(item.indexScoreForm[i]["desc"] == "-"){
                        formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + "-";
                       }else if(item.indexScoreForm[i]["desc"] == "×"){
                        formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + "*";
                        }else if(item.indexScoreForm[i]["desc"] == "/"){
                            formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + "/";
                        }
                       
                   }
                   else if(item.indexScoreForm[i]["type"]=="number"){
                    formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + `${item.indexScoreForm[i]["desc"]}`;
                    }
                    else if(item.indexScoreForm[i]["type"]=="autre"){
                        if(item.indexScoreForm[i]["desc"] == ")"){
                            formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + ")";
                        }else if(item.indexScoreForm[i]["desc"] == "("){
                            formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + "(";
                        }else if(item.indexScoreForm[i]["desc"] == ","){
                            formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + ".";
                        }
                    }
            }
            
        });
            //sc = eval(formuleCalcule);
            console.log("score calculer globale formule", form.formMuti);
            for(var i =0; i<=form.formMuti.length;i++){
                console.log(formuleCalculeGlobal[i]);
                sc.add(eval(formuleCalculeGlobal[i]));
                console.log(`item ${index} of table formule`,eval(item));
            };

            console.log("score calculer", sc);
           // console.log("score calculer globale resultat", eval(formuleCalculeGlobal));
        }

 
        /*
                if (formule && formule.length > 0 && formule == '+') {
            for (let r of responses.responses) {
                for (let op of r.options) {
                    if (op.selected) {
                        sc = sc + parseInt(op.score);
                    }
                }
            }
        }
        else if (formule && formule.length > 1) {
            //f = ((q1 + q2 + q3) * 3) / q4
            formule = formule.toUpperCase();
            let nbr = '';
            let indexToReplace = 0;
            for (let i = 0; i < formule.length + 1; i++) {
                if (formule[i] == 'Q' || (!isNaN(formule[i]) && nbr[0] == 'Q')) {
                    if (indexToReplace == 0 && nbr.length == 0) indexToReplace = i;
                    nbr = nbr + formule[i];
                    console.log(nbr);
                    console.log('ind2rep', indexToReplace);

                } else {
                    if (nbr.length > 0) {
                        let questionScoreValue = 0;
                        let index = parseInt(nbr.substring(1, nbr.length));
                        console.log('ind', nbr);
                        console.log('index', index);
                        for (let opR of responses.responses[index - 1].options) {
                            if (opR.selected) {
                                questionScoreValue = questionScoreValue + parseInt(opR.score);
                            }
                        }
                        formule = formule.substring(0, indexToReplace) + questionScoreValue.toString() + " " + formule.substring(indexToReplace + nbr.length);
                        nbr = '';
                        indexToReplace = 0;
                        console.log(formule);
                    }
                }
            }
            sc = eval(formule);
        }
*/
        responses.score = sc;
//-----------------------------------
/*
        if (form.messages && Array.isArray(form.messages)) {
            Array.from(form.messages).forEach(message => {
                if (String(message.score).includes("-")) {
                    // lb-ub
                    // ^\*-[0-9]|[0-9]+\-[0-9*]+|[0-9*]\-[0-9]*
                    let bounds = String(message.score).split('-')
                    let lowerBound = bounds[0]
                    let upperBound = bounds[1]
                    if (lowerBound === '*' && upperBound !== '*' && sc <= Number.parseInt(upperBound)) {
                        responses.message = message.message;
                        return;
                    }
                    if (upperBound === '*' && lowerBound !== '*' && sc >= Number.parseInt(lowerBound)) {
                        responses.message = message.message;
                        return;
                    }
                    if (lowerBound !== '*' && upperBound !== '*' && (Number.parseInt(lowerBound) <= sc && sc <= Number.parseInt(upperBound))) {
                        responses.message = message.message;
                        return;
                    }

                } else {
                    if (Number.parseInt(String(message.score)) === sc) {
                        responses.message = message.message;
                        return;
                    }
                }
            })
            if (!responses.message) {
                responses.message = '*'
            }
        }
*/

        responses.message = 'message formulaire';
        responses.state = 'completed';
        let savedresponses = await responses.save()
        await Affect.findOneAndUpdate({ user: savedresponses.user, form: savedresponses.form },
            { $set: { dateRemplissage: new Date(), etat: true, state: "Completed" } }
        )
        res.status(200).send(savedresponses);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: "Erreur", error });
    }
});
router.get('/getresponses', verifyToken, async (req, res) => {

    try {
        let responses = await Response.find({ archived: false })

        res.status(200).send(responses);
    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
    }

});

router.put('/confirme', verifyToken, async (req, res) => {
    let data = req.body;
    try {
        await Response.findOneAndUpdate({ _id: data.id },
            { $set: { confirmationDate: new Date(), state: "confirmed" } }
        )
        res.status(200).send({ message: "success" });
    } catch (error) {
        res.status(400).send({ message: "erreur occured" });
    }
})

router.delete('/deleteresponses/:id', verifyToken, async (req, res) => {
    try {
        let id = req.params.id;

        let deletedresponses = await Response.findByIdAndDelete({ _id: id })

        if (!deletedresponses) {
            res.status(404).send('not found')
        } else {
            res.status(200).send(deletedresponses);
        }
    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
    }
});

router.put('/updateresponses/:id', verifyToken, async (req, res) => {
    try {
        let id = req.params.id;
        let data = req.body

        let updatedresponses = await Response
            .findByIdAndUpdate({ _id: id }, {
                $set: {
                    user: data.user,
                    doctor: data.doctor,
                    created_date: data.created_date,
                    responses: data.responses,
                    archived: data.archived,
                    form: data.form
                }
            })

        if (!updatedresponses) {
            res.status(404).send('not found')
        } else {
            res.status(200).send(updatedresponses);
        }
    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
    }
});

router.get('/archived/:id', verifyToken, async (req, res) => {
    try {
        let id = req.params.id;
        let updatedresponses = await Response.findByIdAndUpdate({ _id: id }, { $set: { archived: true } })
        if (!updatedresponses) {
            res.status(404).send('not found')
        } else {
            res.status(200).send(updatedresponses);
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: "Erreur", error });
    }
});

router.get('/getresponsesbyid/:id', verifyToken, async (req, res) => {
    try {
        let id = req.params.id;

        let responses = await Response.findOne({ _id: id })

        if (!responses) {
            res.status(404).send('not found')
        } else {
            res.status(200).send(responses);
        }

    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
    }
});
router.get('/getpopulatedresponsesbyid/:id', verifyToken, async (req, res) => {
    try {
        let id = req.params.id;

        let responses = await Response.findOne({ _id: id }).populate("form")

        if (responses.form.archived || !responses) {
            res.status(404).send('not found')
        } else {
            res.status(200).send(responses);
        }

    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
    }
});

router.get('/check/:user/:form', verifyToken, async (req, res) => {
    try {
        let user = req.params.user;
        let form = req.params.form;

        let patient = await Patient.findOne({ _id: user, archived: false })
        let formFromDb = await Forms.findOne({ _id: form, archived: false })

        if (!patient || !formFromDb) {
            return res.status(404).send({ message: "Not found" })
        }

        let responses = await Response.findOne({ user: user, form: form })

        if (!responses) {
            res.status(404).send('not found')
        } else {
            res.status(200).send(responses);
        }
    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
    }
});

router.get('/getformresponse/:user/:form', verifyToken, async (req, res) => {
    try {
        let user = req.params.user;
        let form = req.params.form;

        let doctor = await Doctor.findOne({ _id: user, archived: false })
        let formFromDb = await Forms.findOne({ _id: form, archived: false })

        if (!doctor || !formFromDb) {
            return res.status(404).send({ message: "Not found" })
        }

        let responses = await Response.find({ doctor: user, form: form })

        res.status(200).send(responses);
    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
    }
});

router.get('/getuserformresponse/:user/:doctor/:form', verifyToken, async (req, res) => {
    try {
        let user = req.params.user;
        let form = req.params.form;
        let doctor = req.params.doctor;

        let responses = await Response.findOne({ doctor: doctor, form: form, user: user })

        res.status(200).send(responses);
    } catch (error) {
        res.status(400).send({ message: "Erreur", error });
    }
});
router.get('/getusersresponses', verifyToken, async (req, res) => {
    let distinctUser = await Response.aggregate([{
        $group: {
            _id: "$user",
        },
    }])

    let users = []
    for (const u of distinctUser) {
        let response = await Response.find({ user: u._id })
        users.push({ user: u._id, response })
    }
    res.status(200).send({ users })
})

router.get('/getusersresponses/:id', verifyToken, async (req, res) => {
    try {
        let responses = await Response.find({ user: req.params.id })
        res.status(200).send({ responses })
    } catch (error) {
        res.status(400).send({ message: "error" })
    }

})
module.exports = router;

//test