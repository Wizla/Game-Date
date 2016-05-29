var express = require('express');
var bodyParser = require('body-parser');
var stripe = require('stripe')('sk_test_C6vsNbBNzZYsuTTS9srxUhJq');

var app = express();
app.use(bodyParser());

app.post('/charge', function(req, res) {
    var stripeToken = req.body.stripeToken;
    var amount = 1000;

    stripe.charges.create({
        card: stripeToken,
        currency: 'usd',
        amount: amount
    },
    function(err, charge) {
        if (err) {
            res.send(500, err);
        } else {
            res.send(204);
        }
    });
});

app.use(express.static(__dirname));
app.listen(process.env.PORT || 3000);