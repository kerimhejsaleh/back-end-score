var paypal = require('paypal-rest-sdk');

var express = require('express');
var router = express.Router();

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
router.get('/success/:id/:total/:currency', (req, res) => {
console.log(req.params.id,req.params.total,req.params.currency)
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
          console.log(JSON.stringify(payment));
          res.send('Success');
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
module.exports = router