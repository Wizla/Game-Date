var http = require("http");
var express = require('express');
var request = require("request");
var path = require("path");
var bodyParser = require("body-parser");
var fs = require("fs");
var _ = require("underscore");
var app = express();

app.use(express.static(__dirname));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.get("/", function (req, res) {
    console.log("Got request");
    res.sendFile(path.join(__dirname,'./index.html'));
});

// Captcha
reCAPTCHA=require('recaptcha2');

recaptcha=new reCAPTCHA({
  siteKey:'6Ld-NSETAAAAAKc_73hZB9BRdfpC8UQI_I6ifdL0',
  secretKey:'6Ld-NSETAAAAAA0JcTjyUGstvaQ5HcYqXucQK_HU'
})
// Captcha with body parser
function submitForm(req,res){
  recaptcha.validateRequest(req)
  .then(function(){
    // validated and secure
          document.getElementById("register-submit").style.display='block';
    res.json({formSubmit:true})
  })
  .catch(function(errorCodes){
    // invalid
    res.json({formSubmit:false,errors:recaptcha.translateErrors(errorCodes)});// translate error codes to human readable text
  });
}
// Quotes of the day!
var quotes = [
  { author : 'Mae West', text : "You only live once, but if you do it right, once is enough."},
  { author : 'Oscar Wilde', text : "Be yourself; everyone else is already taken."},
  { author : 'Albert Einstein', text : "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe."},
  { author : 'Dr. Seuss', text : "Don't cry because it's over, smile because it happened."},
  { author : 'Wido Steenmans', text : "Cloud API Is as hard as a rock!"}
];

app.get('/', function(req, res) {
  res.json(quotes);
});

app.get('/quote/random', function(req, res) {
  var id = Math.floor(Math.random() * quotes.length);
  var q = quotes[id];
  res.json(q);
});

app.get('/quote/:id', function(req, res) {
  console.log("Hello");
  if(quotes.length <= req.params.id || req.params.id < 0) {
    res.statusCode = 404;
    return res.send('Error 404: No quote found');
  }

  var q = quotes[req.params.id];
  res.json(q);
});

app.post('/quote', function(req, res) {
  if(!req.body.hasOwnProperty('author') || !req.body.hasOwnProperty('text')) {
    res.statusCode = 400;
    return res.send('Error 400: Post syntax incorrect.');
  }

  var newQuote = {
    author : req.body.author,
    text : req.body.text
  };

  quotes.push(newQuote);
  res.json(true);
});

app.delete('/quote/:id', function(req, res) {
  if(quotes.length <= req.params.id) {
    res.statusCode = 404;
    return res.send('Error 404: No quote found');
  }

  quotes.splice(req.params.id, 1);
  res.json(true);
});

app.listen(3000);