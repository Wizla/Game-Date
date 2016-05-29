var http = require("http");
var express = require('express');
var request = require("request");
var path = require("path");
var bodyParser = require('body-parser');
var fs = require("fs");
var _ = require("underscore");
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
    res.json({formSubmit:true})
  })
  .catch(function(errorCodes){
    // invalid
    res.json({formSubmit:false,errors:recaptcha.translateErrors(errorCodes)});// translate error codes to human readable text
  });
}

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

app.listen(3000);