require('dotenv').config();
var express = require('express');
var path = require('path');
const bodyParser = require('body-parser');
const http = require('http');

// Slack SDK
const WebClient = require('@slack/client').WebClient;
// Events API module
const slackEventsAPI = require('@slack/events-api');
// Interactive Messages module
const slackInteractiveMessages = require('@slack/interactive-messages');

// Events API Adapter
const slackEvents = slackEventsAPI.createSlackEventAdapter(process.env.SLACK_VERIFICATION_TOKEN);
// Interactive Messages Adapter
const slackMessages = slackInteractiveMessages.createMessageAdapter(process.env.SLACK_VERIFICATION_TOKEN);

// Server setup
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Authorized user
let authID;
// User:channel storage
let users = [];
// Server port
const PORT = process.env.PORT || 4390;

// Server endpoints for Slack
app.use('/slack/events', slackEvents.expressMiddleware());
app.use('/slack/actions', slackMessages.expressMiddleware());
// Slack Web API clients
const bot = new WebClient(process.env.SLACK_BOT_TOKEN);
const web = new WebClient(process.env.SLACK_AUTH_TOKEN);

var string = 'test';

// Starts server and tracks authorized user
app.listen(PORT, function() {
	console.log("Bot listening on port " + PORT);
});

slackEvents.on('user_change', (event) => {
  console.log(event);
  var status = event.user.profile.status_text;
  string = status;
  // var path = `http://285b6542.ngrok.io/set_profile/${status}`;
  // http.get(path);
});

// viewed at http://localhost:8080
// app.get('/set_profile/:status', function(req, res) {
// 	string = req.params.status;
// 	res.sendStatus(200);
// });

app.get('/get_profile', function(req, res) {
	res.send(string);
});

app.get('/', function(req, res){
	res.send("I'M UP");
});

console.log('running')

app.listen(8080);
