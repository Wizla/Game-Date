var http = require("http");
var express = require('express');
var request = require("request");
var path = require("path");
var bodyParser = require('body-parser');
var fs = require("fs");
var _ = require("underscore");

var app = express();
var originalData;
var mapData;

var interval = setInterval(function () {

    console.log("refreshing originalData");
    getData();

}, 600000);

var init = function () {
    console.log("filling in originalData for the first time");
    getData();
}

var getData = function () {

    var url = "http://datasets.antwerpen.be/v4/gis/wifiopenbaar.json";
    request({ url: url, json: true }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            originalData = body;
            //var s = JSON.stringify(temp)   //test to see what i get back
            //fs.writeFile("i.txt", s, 'utf8'); //write this to a local file
        }
    });
    //var url = "http://datasets.antwerpen.be/v4/gis/wifiopenbaar.map";
    //request({ url: url }, function (error, response, body) {
    //    if (!error && response.statusCode == 200) {
    //        console.log("something " + body);
    //        mapData = body;
    //    }
    //});
    //console.log(mapData);
}

////http.createServer(function (req, res) {

////    console.log("Got request");

////    switch (req.url) {
////        case "mystyle.css":
////            send.writeHead(200, { "Content-Type": "text/css" });
////            send.sendfile('./mystyle.css');
////            break;
////        case "myApp.js":
////            send.writeHead(200, { "Content-Type": "text/json" });
////            send.sendfile('./myApp');
////            break;
////        default:
////            res.writeHead(200, { "Content-Type": "text/html" });
////            console.log("rolf");
////            res.send(200,"<p>fgflmkdfm</p>");
////            //send.sendfile('./Hotwifispot.html');
////            console.log("sended html");
////            break;
////    }

////}).listen(3000);

app.use(express.static(__dirname));

app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/", function (req, res) {

    console.log("Got request");
    res.sendFile(path.join(__dirname,'./Hotwifispot.html'));

});

app.post("/city", function (req,res) {
    
    console.log("post request  " + req.body.gemeente);
    var city = req.body.gemeente;
    var filtered = _.where(originalData.data, { gemeente: city });
    res.json(filtered);

})
app.listen(3000);
init();