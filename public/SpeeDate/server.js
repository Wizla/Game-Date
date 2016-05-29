var http = require("http");
var express = require('express');
var request = require("request");
var path = require("path");
var bodyParser = require('body-parser');
var fs = require("fs");
var _ = require("underscore");

var app = express();


app.use(express.static(__dirname));


app.get("/", function (req, res) {

    console.log("Got request");
    res.sendFile(path.join(__dirname,'./index.html'));

});

app.listen(3000);