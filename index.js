// Require Express JS и Body Parser for JSON POST acceptance
require('dotenv').config();
var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');

const accountSid = process.env.SID;
const authToken = process.env.KEY;
const client = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false}));

// Handle POST request
app.post('/incoming', function (req, res) {
    const twiml = new MessagingResponse();
    var data = req.body; // New messages in the "body" variable

    if(data.Body.toLowerCase().trim() == "" && data.Body.toLowerCase().trim()!="hi" && data.Body.toLowerCase().trim()!="hello" && data.Body.toLowerCase().trim()!="test" && data.Body.toLowerCase().trim()!="help"){

        request('https://api.duckduckgo.com/?skip_disambig=1&format=json&pretty=1&q='+data.Body, function (error, response, body) {
            body = JSON.parse(body)
            console.log('body:', body["Abstract"]);
            
            if(body["Abstract"] == ""){
                body["Abstract"]= body["RelatedTopics"][0]["Text"]
            }
            
            var msg = twiml.message(`*`+body["Heading"]+`*

            `+body["Abstract"]);
            res.writeHead(200, {'Content-Type': 'text/xml'});
            res.end(twiml.toString());
        });
    } else {
        var msg = twiml.message(`*Hey 👋*

        I am a bot which in the near future is going to assist you with your certificate needs
        
        For now i summarize WikiPedia pages to help you find quick information, right within WhatsApp.

        Try it out - send me anything you want to know about`)
        res.writeHead(200, {'Content-Type': 'text/xml'});
        res.end(twiml.toString());
    }
});

app.post('/check', function(req, res) {
    console.log(req.body.Body)
});

app.get('/', function(request, response) {
    response.sendFile(__dirname + '/views/index.html');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});