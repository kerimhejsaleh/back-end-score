var paypal = require('paypal-rest-sdk');
const https = require('https');
const axios = require('axios');
var express = require('express');
var router = express.Router();
const { Doctor } = require('../models/doctor');
const { Achat } = require('../models/achat');
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'ATzpF0ntzeI-IXCh2ReiLRRS0ft3SU24goI8uqkSYJN1BzA-AUQcNMQx3upmYuwEl6q5NYD6e2r9uFjM',
  'client_secret': 'ED1jI0nMbeRyCfYlEA7vWzoDk6qAGFIbCy8xA6WIJmUNxr31RgwyzIji238X29_iAKO_iZ-ICQDhHdky'
});
router.post('/pay', (req , res) => {
    console.log(1,req.body)
    var create_payment_json = req.body;
    
/*     router.get('/success', (req,res) => {
        var execute_payment_json = {
            "payer_id": req.query.PayerID,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": "1.00"
                }
            }]
        };
        
        var paymentId = req.query.paymentId;
        
        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            if (error) {
                console.log(error.response);
                throw error;
            } else {
                console.log("Get Payment Response");
              console.log(JSON.stringify(payment));
            }
        });
    }) */
    console.log(2)
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            console.log("Create Payment Response");
          //  console.log(payment.links);
            for(let i = 0 ; i < payment.links.length; i++) {
                if(payment.links[i].rel == 'approval_url') {
                    console.log(payment.links[i].href);
                  /*   res.redirect(payment.links[i].href); */
                  res.status(200).send({ url :payment.links[i].href })
                }
            }
        }
    });
})
router.get('/success/:id/:total/:currency/:type', (req, res) => {
/* console.log(req.params.id,req.params.total,req.params.currency,req.params.type) */
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
 // console.log("payerId",payerId,"paymentId",paymentId)
    const execute_payment_json = {
      "payer_id": payerId,
      "transactions": [{
          "amount": {
              "currency": "USD",
              "total": req.params.total
          }
      }]
    };
  
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      if (error) {
          console.log(error.response);
          throw error;
      } else {
            axios.post("http://localhost:3000/achat/addachat",{
                    "user" :req.params.id,
                    "type":req.params.type
                }) 
        
          res.send(`<html>
          <head>
            <link href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,400i,700,900&display=swap" rel="stylesheet">
          </head>
            <style>
              body {
                text-align: center;
                padding: 40px 0;
                background: #EBF0F5;
              }
                h1 {
                  color: rgb(212, 66, 38);
                  font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
                  font-weight: 900;
                  font-size: 40px;
                  margin-bottom: 10px;
                }
                p {
                  color: #404F5E;
                  font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
                  font-size:20px;
                  margin: 0;
                }
              i {
                color: rgb(212, 66, 38);
                font-size: 100px;
                line-height: 200px;
                margin-left:-15px;
              }
              .card {
                background: white;
                padding: 60px;
                border-radius: 4px;
                box-shadow: 0 2px 3px #C8D0D8;
                display: inline-block;
                margin: 0 auto;
              }
            </style>
            <body>
              <div class="card">
              <div style="border-radius:200px; height:200px; width:200px; background: #F8FAF5; margin:0 auto;">
                <i class="checkmark">✓</i>
              </div>
                <h1>Succès</h1> 
                <p>Nous avons reçu votre d’achat;</p>
              </div>
            </body>
        </html>`);
       
      }
  });
});
router.get('/cancel', (req, res) => res.send('Cancelled'));
router.get('/history', (req, res) =>{ 
    var listPayment = {
        'count': '10',
        'start_index': '0'
    };
    paypal.payment.list(listPayment, function (error, payment) {
        if (error) {
            throw error;
        } else {
            console.log("List Payments Response");
            console.log(payment.payments[0].transactions);
            res.status(200).send({ history :JSON.stringify(payment) })
        }
    });
});
function addMonths(numOfMonths, date = new Date()) {
    date.setMonth(date.getMonth() + numOfMonths);
    
    return date;
  }
/*   function addachatT(id,type){
  
    router.post('/addachat', async (req, res) => {
        try {
            console.log(id,type,"hh")
            obj = req.body;
          
             if(achatForm==null) {
             console.log("1")  
             if(obj.type){
              let achat = new Achat({
                user:id,
                datedefin:addMonths(1, new Date()),
                datedebut:new Date(),
                type:type
        
              }); 
              await achat.save()
              return res.status(200).send({ result: true })
             }else{
              let achat = new Achat({
                user:id,
                datedefin:addMonths(12, new Date()),
                datedebut:new Date(),
                type:type
        
              }); 
              await achat.save()
              return res.status(200).send({ result: true })
             }
                      
              
             }else{
           if(achatForm.type && type){
                if(new Date()<achatForm.datedefin){
                  return res.status(200).send({result :"déja payé"});
                }else{
                  achaUpdate = await Achat.findByIdAndUpdate({ _id: achatForm._id }, { $set: {  datedefin: addMonths(1, new Date()),
                    datedebut: new Date(),
               
                  } });
                    return res.status(200).send({result :achaUpdate});
                }
              }
              if(!achatForm.type && !type){
                if(new Date()<achatForm.datedefin){
                  return res.status(200).send({result :"déja payé"});
                }else{
                  achaUpdate = await Achat.findByIdAndUpdate({ _id: achatForm._id }, { $set: {  datedefin: addMonths(12, new Date()),
                    datedebut: new Date(),
                 
                  } });
                    return res.status(200).send({result :achaUpdate});
                }
              }
              if(achatForm.type && !type){
                if(new Date()<achatForm.datedefin){
                  return res.status(200).send({result :"déja payé"});
                }else{
                  achaUpdate = await Achat.findByIdAndUpdate({ _id: achatForm._id }, { $set: {  datedefin: addMonths(12, new Date()),
                    datedebut: new Date(),
                    type:type
                  } });
                    return res.status(200).send({result :achaUpdate});
                }
              }
              if(!achatForm.type && type){
                if(new Date()<achatForm.datedefin){
                  return res.status(200).send({result :"déja payé"});
                }else{
                  achaUpdate = await Achat.findByIdAndUpdate({ _id: achatForm._id }, { $set: {  datedefin: addMonths(1, new Date()),
                    datedebut: new Date(),
                    type:obj.type
                  } });
                    return res.status(200).send({result :achaUpdate});
                }
              } 
             }
           
       
    
           
        } catch (error) {
            res.status(400).send({ message: "Erreur", error });
        }
    });
  }
 */
module.exports = router