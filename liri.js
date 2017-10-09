// Constructors for Spotify and Twitter
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');

// Package for HTTP calls
var request = require('request');

// File System pkg
var fs = require('fs');

// Grab the key data from keys.js
var keys = require('./keys.js');

//Make REST api client objects
var spotify = new Spotify({
  id: keys.spotifyKeys.client_id,
  secret: keys.spotifyKeys.client_secret
});
var twitter = new Twitter({
  consumer_key: keys.twitterKeys.consumer_key,
  consumer_secret: keys.twitterKeys.consumer_secret,
  access_token_key: keys.twitterKeys.access_token_key,
  access_token_secret: keys.twitterKeys.access_token_secret
});

var cmdLineArgs = process.argv;
console.log("Command Line Args: ", process.argv);

var command = process.argv[2];
var item = process.argv[3];
console.log("argv[0] and argv[1] had better be 'node' and 'liri' (or 'liri.js'), respectively");
console.log("process.argv[0]: ", process.argv[0]);
console.log("process.argv[1]: ", process.argv[1]);
console.log("process.argv[2]: 'command' ", command);
console.log("process.argv[3]: 'item' ", item);

var liriObj = {

	processTweets: function () {
		console.log("liriObj.processTweets: ");
		// Construct query and show the results
		var params = {screen_name: 'Al_n_Dev'};
		twitter.get('statuses/user_timeline', params, function(error, tweets, response) {
  			if (!error) {
    			console.log(tweets);
  			}
		});
	},

	processSpotify: function () {
		console.log("liriObj.processSpotify: ");
		// Construct query and show the results
		spotify
		  .request('https://api.spotify.com/v1/tracks/7yCPwWs66K8Ba5lFuU2bcx')
		  .then(function(data) {
		    console.log(data); 
		  })
		  .catch(function(err) {
		    console.error('Error occurred: ' + err); 
		  });
	},

	processOmdb: function () {
		console.log("liriObj.processOmdb: ");
		// construct query and show the results
		request('http://www.omdbapi.com/?t=dark+star&y=&plot=short&apikey=40e9cece', function (error, response, body) {
  		console.log('error:', error); // Print the error if one occurred
  		console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  		console.log('body:', body); 
		});
	},

	processRandom: function () {
		console.log("liriObj.processRandom: ");
		// Read the random.txt file and then... do-what-it-says
	},

	showUsage: function () {
		console.log("--------------------------");
		console.log("Liri Usage: you must type:");
        console.log("node liri <command>");
        console.log("--------------------------");
        console.log("\twhere <command> is one of the following:");
        console.log("\tmy-tweets");
        console.log("\tspotify-this-song 'song name'");
        console.log("\tmovie-this 'movie title'");
        console.log("\tdo-what-it-says");
        console.log("\tnote: 'spotify-this-song' or 'movie-this' option");
        console.log("\t      should be followed by a quoted string (song or movie, resp.) ");
		console.log("--------------------------");		
	},

	showKeys: function () {
		// Print everything in exports.
		console.log("--------------------------");
		console.log("EXPORTS");
		console.log(keys);
		console.log("--------------------------");
		// Print exports individually
		console.log("twitterKeys:");
		console.log(keys.twitterKeys);
		console.log("--------------------------");
		console.log("spotifyKeys:");
		console.log(keys.spotifyKeys);
		console.log("--------------------------");
		console.log("omdbKeys:");
		console.log(keys.omdbKeys);
		// Show the client api objects
		console.log("Spotity and Twitter client vars:");
		console.log("Spotify: ", spotify);
		console.log("Twitter: ", twitter);
		console.log("request: ", request);
		console.log("fs: ", fs);
	},
} // liriObj

// Make it so liri.js can take in one of the following commands:
// 	my-tweets
// 	spotify-this-song
// 	movie-this
// 	do-what-it-says
switch(command) {
    case 'my-tweets':
        liriObj.processTweets();
        break;

    case 'spotify-this-song':
        liriObj.processSpotify();
        break;

    case 'movie-this':
        liriObj.processOmdb();
        break;

    case 'do-what-it-says':
        liriObj.processRandom();
        break;

    case 'show-keys':
        liriObj.showKeys();
        break;

    default:
        liriObj.showUsage();
        break;
};

