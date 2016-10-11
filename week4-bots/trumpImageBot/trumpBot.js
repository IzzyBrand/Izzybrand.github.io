var Twit = require('twit')

var T = new Twit({
  consumer_key:         '...',
  consumer_secret:      '...',
  access_token:         '...',
  access_token_secret:  '...'
})
var fs = require('fs');
eval(fs.readFileSync("nodeMarkov.js","utf-8"));
var markov = new MarkovGeneratorWord(2,15)
var text = fs.readFileSync('trump.txt', "utf-8")
markov.feed(text)


var images = ["trump.jpg", "trump2.jpg"]


function generate(){
	var t = markov.generate()
	while(t.length > 140){
		t = markov.generate()
	}
	// T.post('statuses/update', { status: t }, function(err, data, response) {
 //  		console.log(t)
	// })
	var imageFile;
	//choose an image
	// imageFile = "trump.jpg"
	// if(t.search("taxes")){
	// 	imageFile = "trump2.jpg"
	// }

	//take a random image
	imageFile = images[Math.floor(Math.random() * images.length)];

	var trumpImage = fs.readFileSync(imageFile, { encoding: 'base64' })
	T.post('media/upload', { media_data: trumpImage }, function (err, data, response) {
	  var mediaIdStr = data.media_id_string
	  var altText = "Trump sayin some stuff"
	  var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

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

