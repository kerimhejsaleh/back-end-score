const express = require('express');
const jwt = require('jsonwebtoken');

const { Affect } = require('../models/affect');
const { Response } = require('../models/response');
const { Forms } = require('../models/forms');
const { Patient } = require('../models/patient');
const { Doctor } = require('../models/doctor');
const { verifyToken } = require('../middlewares/verifyToken');
const { list } = require('stripe/lib/StripeMethod.basic');


const router = express.Router();

router.post('/addresponse', async (req, res) => {
    
    try {
        let obj = req.body;
        let patient = await Patient.findOne({ _id: obj.user, archived: false })
        let doctor = await Doctor.findOne({ _id: obj.doctor, archived: false })
        let formFromDb = await Forms.findOne({ _id: obj.form, archived: false })
        console.log("patient",patient);
        console.log("doctor",doctor);
        console.log("formFromDb",formFromDb);
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
        let sc = [];
        let form = await Forms.findOne({ _id: responses.form })
        let formule = form.formule;
         formuleMuti = form.formMuti;

        //------------------------------------------------
    console.log("formuleMuti",formuleMuti);

        if (form.formMuti != [] || form.formMuti != undefined) {
            //f = ((q1 + q2 + q3) * 3) / q4
           // formuleMuti = formuleMuti.toUpperCase();
            let nbr = '';
            let indexToReplace = 0;
            let formuleCalcule = "";
            let formuleCalculeGlobal = [];

              for (let index = 0; index < formuleMuti.length; index++) {
                console.log("we are in formule ",index);
                //formuleCalculeGlobal.push("");
                formuleCalcule = "";
            for (let i = 0; i < formuleMuti[index].indexScoreForm.length; i++) {
                console.log("okk");

                   if(formuleMuti[index].indexScoreForm[i]["type"]=="index"){
                //     if(formuleMuti[index].indexScoreForm[i]['i'] == 0 ) { 
                //         if(responses.responses[formuleMuti[index].indexScoreForm[i]["j"]].type == "Cases à cocher"){
                //             for (let j = 0; j < responses.responses[formuleMuti[index].indexScoreForm[i]["j"]]["options"].length; j++) {
                //                 if(responses.responses[formuleMuti[index].indexScoreForm[i]["j"]]["options"][j]["selected"]==true){
                //                     formuleCalcule = formuleCalcule + responses.responses[formuleMuti[index].indexScoreForm[i]["j"]]["options"][j]["score"];
                //                     formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + `${responses.responses[formuleMuti[index].indexScoreForm[i]["j"]]["options"][j]["score"]}`;
                //                 }
                //             }
                //             console.log("formule Cases à cocher 2",formuleCalcule);
                //         }
                //         if(responses.responses[formuleMuti[index].indexScoreForm[i]["j"]].type == "Choix multiples"){
                //             for (let j = 0; j < responses.responses[formuleMuti[index].indexScoreForm[i]["j"]]["optioncm"].length; j++) {
                //                 if(responses.responses[formuleMuti[index].indexScoreForm[i]["j"]]["optioncm"][j]["selected"]==true){
                //                     formuleCalcule = formuleCalcule + responses.responses[formuleMuti[index].indexScoreForm[i]["j"]]["optioncm"][j]["score"];
                //                     formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + `${responses.responses[formuleMuti[index].indexScoreForm[i]["j"]]["optioncm"][j]["score"]}`;

                //                 }
                //             }
                //             console.log("formule  Choix multiples 3",formuleCalcule); 
                //         }
                //         if(responses.responses[formuleMuti[index].indexScoreForm[i]["j"]].type == "VISUELLE ANALOGIQUE"){
                //             formuleCalcule = formuleCalcule + responses.responses[formuleMuti[index].indexScoreForm[i]["j"]]["score"];
                //             formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + `${responses.responses[formuleMuti[index].indexScoreForm[i]["j"]]["score"]}`;

                //             console.log("formule VISUELLE ANALOGIQUE 4",formuleCalcule);
                //         }
                //         if(responses.responses[formuleMuti[index].indexScoreForm[i]["j"]].type=="Range Bar"){
                //             formuleCalcule = formuleCalcule + responses.responses[formuleMuti[index].indexScoreForm[i]["j"]]["scoreOptionRangeBar"];
                //             formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + `${responses.responses[formuleMuti[index].indexScoreForm[i]["j"]]["scoreOptionRangeBar"]}`;

                //             console.log("formule scoreOptionRangeBar 5",formuleCalcule);
                //         }
                //         if(responses.responses[formuleMuti[index].indexScoreForm[i]["j"]].type=="Nomber de jours"){
                //             formuleCalcule = formuleCalcule + parseInt(responses.responses[formuleMuti[index].indexScoreForm[i]["j"]]["minRange"]);
                //             formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + `${parseInt(responses.responses[formuleMuti[index].indexScoreForm[i]["j"]]["minRange"])}`;

                //             console.log("formule Nomber de jours 6",formuleCalcule);
                //         }
                        
                //         // if(responses.responses[item.indexScoreForm[i]["j"]].type=="Grille de cases à cocher"){
                //         //     //console.log("dddddd", responses.responses[item.indexScoreForm[i]["j"]].optionsSaint);
                //         //     for (let j = 0; j < responses.responses[item.indexScoreForm[i]["j"]].optionsSaint.length; j++) {
                //         //         for (let k = 0; k < responses.responses[item.indexScoreForm[i]["j"]].optionsSaint[j].value.length; k++) {
                //         //             if(responses.responses[item.indexScoreForm[i]["j"]].optionsSaint[j].value[0][k]==true){
                //         //                 formuleCalcule = formuleCalcule + 3;
                //         //                 formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + "3";

    
                //         //             }
                //         //             if(responses.responses[item.indexScoreForm[i]["j"]].optionsSaint[j].value[1][k]==true){
                //         //                 formuleCalcule = formuleCalcule + 2;
                //         //                 formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + "2";

    
                //         //             }
                //         //             if(responses.responses[item.indexScoreForm[i]["j"]].optionsSaint[j].value[2][k]==true){
                //         //                 formuleCalcule = formuleCalcule + 1;
                //         //                 formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + "1";

    
                //         //             }
                //         //             if(responses.responses[item.indexScoreForm[i]["j"]].optionsSaint[j].value[3][k]==true){
                //         //                 formuleCalcule = formuleCalcule + 0;
                //         //                 formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + "0";

    
                //         //             }
                //         //         }
                //         //     }
                //         //     console.log("formule 7",formuleCalcule);
                  
                //         // }
                   
                // //    if(responses.responses[item.indexScoreForm[i]["j"]].type=="Grille de cases à cocher 2"){
                // //     for (let j = 0; j < responses.responses[item.indexScoreForm[i]["j"]].scoreOptioncm2.scoreS.length; j++) {
                // //         for (let k = 0; k < responses.responses[item.indexScoreForm[i]["j"]].scoreOptioncm2.scoreS[j].value.length; k++) {
                // //             if(responses.responses[item.indexScoreForm[i]["j"]].scoreOptioncm2.scoreS[j].value[k][j]==true){
                // //                 console.log("score 2",responses.responses[item.indexScoreForm[i]["j"]].scoreOptioncm2.scoreS[j].score );
                // //                 console.log("formule parcoure 2",formuleCalcule);
                // //                 formuleCalcule = formuleCalcule + responses.responses[item.indexScoreForm[i]["j"]].scoreOptioncm2.scoreS[j].score;
                // //                 formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + `${responses.responses[item.indexScoreForm[i]["j"]].scoreOptioncm2.scoreS[j].score}`;

                // //             }
                // //         }
                // //     }
                // // }
                // } 
                   //else if(formuleMuti[index].indexScoreForm[i]['i'] <= 9 && formuleMuti[index].indexScoreForm[i]['j'] <= 9 ) { 
                    let indexScoreQustion = 0;
                    let nbQuestionindex=0;
                    for(let sectionNb = 0 ; sectionNb < formFromDb.sections.length; sectionNb++){
                        for(let quetionNb = 0 ; quetionNb < formFromDb.sections[sectionNb]["questions"].length; quetionNb++){
                        //console.log("section number",formFromDb.sections.length);
                        if(formuleMuti[index].indexScoreForm[i]['i'] == sectionNb && formuleMuti[index].indexScoreForm[i]["j"] == quetionNb ) {
                            indexScoreQustion = nbQuestionindex;
                            console.log("index score quetion",indexScoreQustion);
                        }
                        nbQuestionindex = nbQuestionindex + 1;

                    }}


                    // if(formuleMuti[index].indexScoreForm[i]['i'] == 0 ) {
                    //     indexScoreQustion = formuleMuti[index].indexScoreForm[i]["j"];
                    // }else if(formuleMuti[index].indexScoreForm[i]['i'] == 1 ) { 
                    //     indexScoreQustion = formuleMuti[index].indexScoreForm[i]["j"];
                    // }else if(formuleMuti[index].indexScoreForm[i]['i'] == 2 ) { 
                    //     indexScoreQustion = formuleMuti[index].indexScoreForm[i]["j"];
                    // }else if(formuleMuti[index].indexScoreForm[i]['i'] == 3 ) { 
                    //     indexScoreQustion = formuleMuti[index].indexScoreForm[i]["j"];
                    // }else if(formuleMuti[index].indexScoreForm[i]['i'] == 4 ) { 
                    //     indexScoreQustion = formuleMuti[index].indexScoreForm[i]["j"];
                    // }
                    // else if(formuleMuti[index].indexScoreForm[i]['i'] <= 9 && formuleMuti[index].indexScoreForm[i]['j'] <= 9 ) {
                    //     indexScoreQustion = parseInt(`${formuleMuti[index].indexScoreForm[i]["j"]}${formuleMuti[index].indexScoreForm[i]["i"]}`)
                    // }

                        if(responses.responses[indexScoreQustion].type == "Cases à cocher"){
                            console.log("indexScoreQustion",indexScoreQustion)
                            let scoreCasesAChocher = 0;

                            for (let j = 0; j < responses.responses[indexScoreQustion]["options"].length; j++) {
                                if(responses.responses[indexScoreQustion]["options"][j]["selected"]==true){
                                    scoreCasesAChocher = scoreCasesAChocher + eval(responses.responses[indexScoreQustion]["options"][j]["score"]);
                                   // formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + `${responses.responses[indexScoreQustion]["options"][j]["score"]}`;
                                }
                            }

                            formuleCalcule = formuleCalcule + `${scoreCasesAChocher}`;
                            console.log("score Cases à cocher",formuleCalcule);

                        }
                        else if(responses.responses[indexScoreQustion].type == "Choix multiples"){
                            let scoreChoixMultiple = 0;
                            for (let j = 0; j < responses.responses[indexScoreQustion]["optioncm"].length; j++) {
                                if(responses.responses[indexScoreQustion]["optioncm"][j]["selected"]==true){
                                    scoreChoixMultiple = scoreChoixMultiple + responses.responses[indexScoreQustion]["optioncm"][j]["score"];
                                    //formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + `${responses.responses[indexScoreQustion]["optioncm"][j]["score"]}`;

                                }
                            }
                            formuleCalcule = formuleCalcule + `${scoreChoixMultiple}`;


                            console.log("score Choix multiples",formuleCalcule);
 
                        }
                        else if(responses.responses[indexScoreQustion].type == "VISUELLE ANALOGIQUE"){
                            formuleCalcule = formuleCalcule + `${responses.responses[indexScoreQustion]["score"]}`;
                           // formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + `${responses.responses[indexScoreQustion]["score"]}`;

                            console.log("score VISUELLE ANALOGIQUE",formuleCalcule);

                        }
                        else if(responses.responses[indexScoreQustion].type=="Range Bar"){
                            formuleCalcule = formuleCalcule + `${responses.responses[indexScoreQustion]["scoreOptionRangeBar"]}`;
                            //formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + `${responses.responses[indexScoreQustion]["scoreOptionRangeBar"]}`;

                            console.log("score Range Bar",formuleCalcule);

                        }
                        else  if(responses.responses[indexScoreQustion].type=="Nomber de jours"){
                            formuleCalcule = formuleCalcule + `${responses.responses[indexScoreQustion]["minRange"]}`;
                            //formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + `${parseInt(responses.responses[indexScoreQustion]["minRange"])}`;

                            console.log("score Nomber de jours",formuleCalcule);

                        } 
                    //}

                //         if(responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)].type=="Grille de cases à cocher"){
                //             console.log("dddddd", responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)].optionsSaint);
                //             for (let j = 0; j < responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)].optionsSaint.length; j++) {
                //                 for (let k = 0; k < responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)].optionsSaint[j].value.length; k++) {
                //                     if(responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)].optionsSaint[j].value[0][k]==true){
                //                         formuleCalcule = formuleCalcule + 3;
                //                         formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + "3";

    
                //                     }
                //                     if(responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)].optionsSaint[j].value[1][k]==true){
                //                         formuleCalcule = formuleCalcule + 2;
                //                         formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + "2";

    
                //                     }
                //                     if(responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)].optionsSaint[j].value[2][k]==true){
                //                         formuleCalcule = formuleCalcule + 1;
                //                         formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + "1";

    
                //                     }
                //                     if(responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)].optionsSaint[j].value[3][k]==true){
                //                         formuleCalcule = formuleCalcule + 0;
                //                         formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + "0";

    
                //                     }
                //                 }
                //             }
                //    }
                //    if(responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)].type=="Grille de cases à cocher 2"){
                //     for (let j = 0; j < responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)].scoreOptioncm2.scoreS.length; j++) {
                //         for (let k = 0; k < responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)].scoreOptioncm2.scoreS[j].value.length; k++) {
                //             if(responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)].scoreOptioncm2.scoreS[j].value[k][j]==true){
                //                 console.log("score 2",responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)].scoreOptioncm2.scoreS[j].score );
                //                 console.log("formule parcoure 2",formuleCalcule);
                //                 formuleCalcule = formuleCalcule + responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)].scoreOptioncm2.scoreS[j].score;
                //                 formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + `${responses.responses[parseInt(`${item.indexScoreForm[i]["j"]}${item.indexScoreForm[i]["i"]}`)].scoreOptioncm2.scoreS[j].score}`;

                //             }
                //         }
                //     }
                // }
                        
                
                    
                   }
                   else if(formuleMuti[index].indexScoreForm[i]["type"]=="operation"){
                       if(formuleMuti[index].indexScoreForm[i]["desc"] == "+"){
                        //formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + "+";
                        formuleCalcule = `${formuleCalcule}` + "+";

                       }else if(formuleMuti[index].indexScoreForm[i]["desc"] == "-"){
                        formuleCalcule = `${formuleCalcule}` + "-";
                       }else if(formuleMuti[index].indexScoreForm[i]["desc"] == "×"){
                        formuleCalcule = `${formuleCalcule}` + "*";
                        }else if(formuleMuti[index].indexScoreForm[i]["desc"] == "/"){
                            formuleCalcule = `${formuleCalcule}` + "/";
                        }
                       
                   }
                   else if(formuleMuti[index].indexScoreForm[i]["type"]=="number"){
                    formuleCalculeGlobal[index] = formuleCalculeGlobal[index] + `${formuleMuti[index].indexScoreForm[i]["desc"]}`;
                    formuleCalcule = `${formuleCalcule}` + `${formuleMuti[index].indexScoreForm[i]["desc"]}`;
                    }
                    else if(formuleMuti[index].indexScoreForm[i]["type"]=="autre"){
                        if(formuleMuti[index].indexScoreForm[i]["desc"] == ")"){
                            formuleCalcule = `${formuleCalcule}` + ")";
                        }else if(formuleMuti[index].indexScoreForm[i]["desc"] == "("){
                            formuleCalcule = `${formuleCalcule}` + "(";
                        }else if(formuleMuti[index].indexScoreForm[i]["desc"] == ","){
                            formuleCalcule = `${formuleCalcule}` + ".";
                        }
                    }

            }
            console.log(`formuleCalcule ${index}`, formuleCalcule);

             formuleCalculeGlobal.push(formuleCalcule);

              }

            
            //sc = eval(formuleCalcule);
            console.log("list calculer globale formule", formuleCalculeGlobal);

            for(var i =0; i<form.formMuti.length;i++){
                console.log(formuleCalculeGlobal[i]);
                console.log(`formuleCalculeGlobal[i]`,formuleCalculeGlobal[i][0]);
                if(formuleCalculeGlobal[i][0]!='u'){
                sc.push(eval(formuleCalculeGlobal[i]));}
                console.log(`formuleMutiof table formule`,eval(formuleMuti[i]));
            };

            console.log("score calculer", sc);
             //sc.add("");
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
        console.log("Erreur",error);
        res.status(400).send({ message: "Erreur", error });
    }
});
router.post('/addresponseweb', async (req, res) => {
    
    try {
        let obj = req.body;
      console.log( "jj",req.body)
        let patient = await Patient.findOne({ _id: obj.user, archived: false })
        let doctor = await Doctor.findOne({ _id: obj.doctor, archived: false })
        let formFromDb = await Forms.findOne({ _id: obj.form, archived: false })
   /*      console.log("patient",patient);
        console.log("doctor",doctor);
        console.log("formFromDb",formFromDb); */
   /*      console.log('patient',patient)
        console.log('doctor',doctor)
        console.log('formFromDb',formFromDb) */
        if (!patient || !doctor || !formFromDb) {
            return res.status(404).send({ message: "Not found" })
        }
        let responsesFromDb = await Response.findOne({ doctor: obj.doctor, form: obj.form, user: obj.user })
      /*   console.log('responsesFromDb',responsesFromDb)  */
        if (responsesFromDb) {
            console.log( "jsssssssssssssssj",)
            return res.status(400).send({ message: "Patient already respond" })
        }
 /*      console.log('rrrr',formFromDb.title)
      console.log('description',formFromDb.description)
      console.log('created_date',formFromDb.created_date)
      console.log('sections',formFromDb.sections)
      console.log('messages',formFromDb.messages)
      console.log('formule',formFromDb.formule)
      console.log('archived',formFromDb.archived)
      console.log('rstatusrrr',formFromDb.status)
      console.log('genre',formFromDb.genre)
      console.log('password',formFromDb.password) */
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
        responses.score =req.body.score;
        let sc = [];
        let form = await Forms.findOne({ _id: responses.form })
        let formule = form.formule;
         formuleMuti = form.formMuti;

        //------------------------------------------------
   /*  console.log("responsesresponsesresponses",responses); */

 

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
       /*  responses.score = sc; */
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
        await Affect.findOneAndUpdate({ user: savedresponses.user, form: savedresponses.form,doctor: savedresponses.doctor},
            { $set: { dateRemplissage: new Date(), etat: true, state: "Completed" } }
        )
        
        res.status(200).send(savedresponses);
    } catch (error) {
        console.log("Erreur",error);
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