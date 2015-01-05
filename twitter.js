var twitter = require('ntwitter');

// oAuth for twitter API v1.1
var twit = new twitter({
	consumer_key: '',
	consumer_secret: '',
	access_token_key: '',
	access_token_secret: ''
});

// database inclusion
var mongo = require("mongodb");
var host = "127.0.0.1";
var port = mongo.Connection.DEFAULT_PORT;
var db = new mongo.Db("nodejs-introduction", new mongo.Server(host, port, {}), {safe: true});
var tweetCollection;
db.open(function(error){
	console.log("We are connected! " + host + ":" + port);

	db.collection("tweet", function(error, collection){
		tweetCollection = collection;
	});

});

// each stream of JSON tweet is inserted into mongo DB -
// twitter API v1.1 is JSON default -no need to parse
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
