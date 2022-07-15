var paypal = require('paypal-rest-sdk');

var express = require('express');
var router = express.Router();

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AVBGG4w-m2xWDfeOhwA4b0EqhKXG-alPdUslptewJQQ7FxKIlXQGY7xxC4-9_gC5UcsI9SoQ5EL0QNuF',
  'client_secret': 'EBFscJl8D3-dyKDzvnrz_56iQs8pyjQbgyxDL7Fa7M51vN4wPxXZTiEKFqnqip81W0uzuM3YqDsE2lq8'
});

router.get('/pay', (req , res) => {
    console.log(1)
    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/success",
            "cancel_url": "http://cancel.url"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "item",
                    "sku": "item",
                    "price": "100",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "100"
            },
            "description": "This is the payment description."
        }]
    };
    
    router.get('/success', (req,res) => {
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
                //console.log(JSON.stringify(payment));
            }
        });
    })
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
                    res.redirect(payment.links[i].href);
                }
            }
        }
    });
})


module.exports = router