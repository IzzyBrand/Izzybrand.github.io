var Twit = require('twit')

var T = new Twit({
  consumer_key:         'LcYPUil0aNBHoE0AaCyjdZLUj',
  consumer_secret:      'oP2ADWxfFtkh58wDIuwYlO7o39TGI5rJ4vuit2tLKzGpRFKBVC',
  access_token:         '785735171664334848-dKeFu3RE9pOo61nIeiTRPfyUOLq4iby',
  access_token_secret:  'ZTpfWAVqsB1XK1XiL4vmn3j98iGcIQNwpRSjDgHgudA0W'
})
var fs = require('fs');

var humanGrammar = {
	"tweet" : 	["#question#?", "#question#?", "#statement#."],
	"question" : ["#theyQ", "#youQ"],

	"youQ" : ["#youQStart# #youSense#", "#youQStart# #youSense# #knowledge#", "#youQStart# #youSense# #youThing#", "#youQStart# #youSense#", "#youQStart# #youSense# #knowledge#", "#youQStart# #youSense# #youThing#", "When do you #youSense#"],
	"youQStart" : ["Do you", "Do you", "Why do you", "Do you want to"],
	"youSense" : ["hear", "see", "know", "understand", "wonder", "reach", "feel", "sense"],
	"youThing" : ["that", "them", "those", "#youThingPre# #theThingYouSee#", "#youThingsPre# #theThingsYouSee#"],
	"youThingPre" : ["their", "that", "the", "a"],
	"theThingYouSee" : ["star", "trail", "light", "movement", "history"],
	"youThingsPre" : ["their", "those", "the"],
	"theThingsYouSee" : ["stars", "trails", "things", "ripples", "calls"],

	"theyQ" : ["#theyQStart# they #theyVerb# #usme#", "#theyQStart# they ever #theyVerb# #usme#", "#theyQStart# they #theyTeachVerb# #usme# #knowledge#", "#theyQStart# they ever #theyTeachVerb# #usme# #knowledge#"],
	"usme" : ["us", "us", "us", "us", "me"],
	"theyQStart" : ["Would", "Will", "Can", "When will", "Why would", "How can", "How would", "How will"],
	"theyVerb" : ["know", "reach", "talk to", "find", "take", "speak to", "touch", "show themselves to", "understand"],
	"theyTeachVerb" : ["show", "teach", "explain to", "tell"],
	"knowledge" : ["#knowledgeVerbQ# #knowledgeVerb#"],
	"knowledgeVerbQ" : ["how", "why"],
	"knowledgeVerb" : ["it works", "it happens", "we're here", "they're here", "they left", "it started"],


	"statement" : ["#statementStart# I knew #knowledge#", "#statementStart# I knew", "#statementStart# I could #youSense# #youThing#", "#commandStart# #youThing#"],
	"statementStart" : ["If only", "I wish"],
	"commandStart" : ["Listen to", "Listen for", "Watch", "Watch for", "Look for", "Feel"]
}
var themGrammar = {
	"tweet" : ["#command#.", "#statement#.", "#command#. #statement#.", "#command#. #command#."],
	"command" : ["#statementVerb#", "#statementVerb# FOR US", "REMEMBER", "DO NOT FORGET"],
	"statement" : ["WE ARE #statementVerbing#", "IT IS #statementVerbing#", "#weirdThing# #statementVerbing#", "#weirdThing# #weirdThingAdj#"],
	"weirdThing" : ["THE TIME IS", "THE PAST IS", "THE STARS ARE", "THE LIGHT IS"],
	"weirdThingAdj" : ["ALIVE", "BREATHING", "READY"],
	"statementVerb" : ["LISTEN", "WATCH", "WAIT", "COME", "SPEAK"],
	"statementVerbing" : ["LISTENING", "WATCHING", "WAITING", "COMING", "SPEAKING"]
}
var human = tracery.createGrammar(humanGrammar)
var them = tracery.createGrammar(themGrammar)
var counter = 0
function rand_range(min, max) {
    "use strict";
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}
function garble(text) {
	var len = text.length;
	var num_swaps = rand_range(0, text.length/4);
	for (i = 0; i < num_swaps; i++) { 
    	var new_char = String.fromCharCode(rand_range(33,64));
		text = text.replaceAt(rand_range(0, len), new_char);
	}
	return text
}
var counter = 0
function generate(){
	var t;

	if (counter < 100) {
		counter = counter + 1;
	}
	if (rand_range(0, 200) < counter) {
		t = them.flatten("#tweet#");
		t = garble(t);
	} else {
		t = human.flatten("#tweet#");
	}

	// T.post('media/upload', { media_data: trumpImage }, function (err, data, response) {
	//   var mediaIdStr = data.media_id_string
	//   var altText = "Trump sayin some stuff"
	//   var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
	var meta_params = {}
	T.post('media/metadata/create', meta_params, function (err, data, response) {
	    if (!err) {
	      // now we can reference the media and post a tweet (media will attach to the tweet)
	      var params = { status: t, media_ids: [mediaIdStr] }

	      T.post('statuses/update', params, function (err, data, response) {
	        console.log(t)
	      })
	    }
	  })
	})
}
generate()
setInterval(generate,20 * 60 * 1000)

