// bring in your env variables
require('dot-env');

var twitter = require('twitter');

// oauth for twitter api
var twit = new twitter({
	consumer_key: process.env.CONSUMER_KEY, 
	consumer_secret: process.env.CONSUMER_SECRET,
	access_token_key: process.env.ACCESS_TOKEN,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET 
});

// database inclusion
var mongo = require("mongodb");
var host = "127.0.0.1";
var port = mongo.Connection.DEFAULT_PORT;

var db = new mongo.Db("nodejs-introduction", new mongo.Server(host, port, {}), {safe: true});
var tweetCollection;

// start the connection to mongodb
db.open(function(error){
	console.log("We are connected! " + host + ":" + port);

	db.collection("tweet", function(error, collection){
		// tweet collection reference is in global scope
		tweetCollection = collection;
	});

});

// each stream of JSON tweet is inserted into mongo DB -
twit.stream('statuses/filter', {track: 'bieber'}, function(stream) {
	stream.on('data', function(tweet) {
		tweetCollection.insert(tweet, function(error) {
			if(error) {
				console.log("Error: ", error.message);
			} else {
				console.log("Inserted into database");
			}
		});
		setTimeout(stream.destroy, 4000);
	});
});
