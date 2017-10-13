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

// Song, Movie and Tweets constructors -- and display and log prototype functions
var Movie = function (title, year, imdbRating, rottenTomatoesRating, country, language, plot, actors) {
	this.title = title;
	this.year = year;
	this.imdbRating = imdbRating;
	this.rottenTomatoesRating = rottenTomatoesRating;
	this.country = country;
	this.language = language;
	this.plot = plot;
	this.actors = actors;
};

Movie.prototype.display = function () {
	console.log("Movie Title: ", this.title);
	console.log("Year: ", this.year);
	console.log("IMDB Rating: ", this.imdbRating);
	console.log("Rotten Tomatoes Rating: ", this.rottenTomatoesRating);
	console.log("Country: ", this.country);
	console.log("Language: ", this.language);
	console.log("Plot: ", this.plot);
	console.log("Actors: ", this.actors);
};

Movie.prototype.fileLog = function () {
	var logString = "--------------------------\n" + "My Movie: \n";
	for (var key in this) {
		if (this.hasOwnProperty(key)) {
			logString += key + ": " + this[key] + "\n";
		}
	}
	liriObj.logResults(logString);
};

var Song = function (artist, song, album, previewLink) {
	this.artist = artist;
	this.song = song;
	this.album = album;
	this.previewLink = previewLink;
};

Song.prototype.display = function () {
	console.log("Artist: ", this.artist);
	console.log("Song: ", this.song);
	console.log("Album: ", this.album);
	console.log("Preview Link: ", this.previewLink);
};

Song.prototype.fileLog = function () {
	var logString = "--------------------------\n" + "My Song: \n";
	for (var key in this) {
		if (this.hasOwnProperty(key)) {
			logString += key + ": " + this[key] + "\n";			
		}
	}
	liriObj.logResults(logString);
};

var Tweets = function (tweetArray) {
 	this.tweetArray = tweetArray;
};

Tweets.prototype.display = function () {
 	for (var i = 0; i < this.tweetArray.length; i++) {
    	console.log("Tweet: ", this.tweetArray[i]);
 	}
};

Tweets.prototype.fileLog = function () {
	var logString = "--------------------------\n" + "My Tweets: \n";
 	for (var i = 0; i < this.tweetArray.length; i++) {
    	logString += "Tweet: " + this.tweetArray[i] + "\n";	
 	}
 	liriObj.logResults(logString);
};

// ****************************************************************************
// LIRI is Language Interpretation and Recognition Interface
// This is the main object for wrapping all of our LIRI functionality
// LIRI is a command line node app that takes in parameters and gives back data
// ****************************************************************************
var liriObj = {

	processTweets: function () {
		//console.log("liriObj.processTweets: ");
		// Construct query and show the results
		var params = {screen_name: 'Al_n_Dev'};
		twitter.get('statuses/user_timeline', params, function(error, tweets, response) {
  			if (!error) {
  				console.log("--------------------------");
  				console.log("Showing Tweets for: ", tweets[0].user.name);
  				console.log("Screen Name: ", tweets[0].user.screen_name);
  				console.log("--------------------------");
    			//console.log(tweets);
    			//console.log(response);
    			var tweetArr = [];
    			for (var i = 0; i < tweets.length; i++) {
    				tweetArr.push(tweets[i].text);
    			};
    			// Make a Tweets (i.e. tweet array) and display it
    			var tweets = new Tweets (tweetArr);
    			tweets.display();
    			tweets.fileLog();	// and log it to the log file
  			}
		});
	},

	processSpotify: function (item="The Sign Ace of Base") {
		//console.log("liriObj.processSpotify: ");
		//console.log("item: ", item);
		// Construct query and show the results
		spotify.search({ type: 'track', query: item, limit: 1 }, function(error, data) {
  			if (error) {
    			return console.log('Error occurred: ' + error);
  			}

  			// Make a song and display it
  			var song = new Song (data.tracks.items[0].artists[0].name, data.tracks.items[0].name, 
  								data.tracks.items[0].album.name, data.tracks.items[0].href);
  			song.display();
  			song.fileLog();	// and log it to the log file 
		});		
	},

	processOmdb: function (item="Mr. Nobody") {
		//console.log("liriObj.processOmdb: ");
		//console.log("item: ", item);
		// Construct query and show the results
		request("http://www.omdbapi.com/?t=" + item + "&y=&plot=short&apikey=40e9cece", function (error, response, body) {
			//console.log("response: ", response);
			//console.log("body: ", body);
		  	if (error) {
    			return console.log('Error occurred: ' + error);
  			}
  			if (response && response.statusCode!==200) {
    			return console.log('Something Went Wrong statusCode: ' + response.statusCode);
  			}

            var pBody = JSON.parse(body);
            //console.log("JSON parsed body: ", pBody);

            if (pBody.Response === 'True') {
  				// Make a movie and display it
  				// Fix for missing Rotten Tomatoes rating - search could crash for missing Ratings (search for title "vomit" e.g.)
  				if (pBody.Ratings[0]) {
  					var movie = new Movie (pBody.Title, pBody.Year, pBody.imdbRating, pBody.Ratings[0].Value, pBody.Country, pBody.Language, 
  									pBody.Plot,  pBody.Actors);
  				} else {
  					var movie = new Movie (pBody.Title, pBody.Year, pBody.imdbRating, "N/A", pBody.Country, pBody.Language, 
  									pBody.Plot,  pBody.Actors);
  				}
  				movie.display();
  				movie.fileLog();	// and log it to the log file         	
      
        	} else {
        		console.log("Error Retrieving Data: ", pBody.Error);
        	}
		});
	},

	processRandom: function () {
		//console.log("liriObj.processRandom: ");
		// Read the random.txt file and then... do-what-it-says
		fs.readFile("random.txt", "utf8", function(error, data) {
			// If the code experiences any errors it will log the error to the console.
			if (error) {
			  return console.log(error);
			}
			// show the data
			console.log(data);
			
			// Break down into argumements
			var dataArr = data.split(",");
			
			// Have LIRI process the command arguments read from the file
			liriObj.processCommand(dataArr[0], dataArr[1]);
		});
	},

	// Save results of LIRI commands in the log.txt file
	logResults: function (data) {
		fs.appendFile("log.txt", data + "\n", function(error) {
  			// Show any error
  			if (error) {
    			console.log(err);
  			} else {
    			console.log("Data logged");
  			}
		});
	},

	// Show the contents of the log.txt file
	// Only clear the file if user types an additional 'clear' command line parameter
	dumpLog: function (item) {
		fs.readFile("log.txt", "utf8", function(error, data) {
  			// Show any error
  			if (error) {
    			return console.log(error);
  			}
  			console.log(data);

			if (item==='clear') {
				fs.writeFile("log.txt", " -- LIRI Log File -- " + "\n", function(err) {
	  				// Show any error
	  				if (err) {
	    				return console.log(err);
	  				}
	    			console.log("LIRI log file cleared");
				});
			}
		});
	},

	// Tell the user what they can do
	showUsage: function () {
		console.log("--------------------------");
		console.log("Liri Usage: you must type:");
        console.log("node liri COMMAND");
        console.log("--------------------------");
        console.log("where COMMAND is one of the following:");
        console.log("\tmy-tweets");
        console.log("\tspotify-this-song 'song name'");
        console.log("\tmovie-this 'movie title'");
        console.log("\tdo-what-it-says");
        console.log("\tdump-log <clear>");
        console.log("notes: ");
        console.log("\t'spotify-this-song' or 'movie-this' option");
        console.log("\tshould be followed by a quoted string (song or movie, resp.) ");
        console.log("\t'do-what-it-says' reads file random.txt for command input");
        console.log("\t<clear> flag on dump-log command is optional and will erase log");
		console.log("--------------------------");

	},

	showKeys: function () {
		// Print everything in exports.
		console.log("--------------------------");
		console.log("Keys");
		console.log(keys);
		console.log("--------------------------");
	},

	fileLogKeys: function () {
		// Log the keys to the log file individually
		this.logResults("twitterKeys:");
		this.logResults(JSON.stringify(keys.twitterKeys));
		this.logResults("spotifyKeys:");
		this.logResults(JSON.stringify(keys.spotifyKeys));
		this.logResults("omdbKeys:");
		this.logResults(JSON.stringify(keys.omdbKeys));
	},

	showClients: function () {
		// Show the client api objects		
		console.log("--------------------------");
		console.log("Spotity and Twitter client vars:");
		console.log("--------------------------");
		console.log("Spotify: ", spotify);
		console.log("--------------------------");
		console.log("Twitter: ", twitter);
		console.log("--------------------------");
	},

	showPackages: function () {
		// Show packages
		console.log("--------------------------");
		console.log("request: ", request);
		console.log("--------------------------");
		console.log("fs: ", fs);
		console.log("--------------------------");
	},

	// Parse the command line arguments
	processCmdLine: function (cmdLineArgs) {
		var cmdLineArgs = process.argv;
		//console.log("Command Line Arguments: ", cmdLineArgs);

		var command = process.argv[2];
		var item = process.argv[3];

		this.processCommand(command, item);
	},

	// Look up the LIRI command for processing
	processCommand: function (command, item) {
	// Make it so liri.js can take in one of the following commands:
	// 		my-tweets
	// 		spotify-this-song
	// 		movie-this
	// 		do-what-it-says
	// 		dump-log (accepts optional <clear> tag)
	// 		various other for debug and for fun
		switch(command) {
    		case 'my-tweets':
    		    this.processTweets();
    		    break;
		
    		case 'spotify-this-song':
    		    this.processSpotify(item);
    		    break;
		
    		case 'movie-this':
    		    this.processOmdb(item);
    		    break;
		
    		case 'do-what-it-says':
    		    this.processRandom();
    		    break;
		
    		case 'show-keys':
    		    this.showKeys();
    		    break;

    		case 'filelog-keys':
    		    this.fileLogKeys();
    		    break;

    		case 'show-clients':
    		    this.showClients();
    		    break;

    		case 'show-pkgs':
    		    this.showPackages();
    		    break;

    		case 'dump-log':
    			this.dumpLog(item);
    			break;
		
    		default:
    		    this.showUsage();
    		    break;
		};
	},

} // liriObj

// Use the LIRI Object to fullful user requests
liriObj.processCmdLine();
