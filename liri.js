// At the top of the liri.js file, write the code you need to grab the data from keys.js. Then store the keys in a variable.
var keys = require('./keys.js');
//var liri = require('./liri.js');

var cmdLineArgs = process.argv;
console.log("Command Line Args: ", process.argv);

var command = process.argv[2];
console.log("argv[0] and argv[1] had better be 'node' and 'liri' (or 'liri.js'), respectively");
console.log("process.argv[0]: ", process.argv[0]);
console.log("process.argv[1]: ", process.argv[1]);
console.log("process.argv[2]: ", command);

var liriObj = {

	processTweets: function () {
		console.log("liriObj.processTweets: ");
		// Show my tweets
	},

	processSpotify: function () {
		console.log("liriObj.processSpotify: ");
		// Show my tweets
	},

	processOmdb: function () {
		console.log("liriObj.processOmdb: ");
		// Show my tweets
	},

	processDoWhatItSays: function () {
		console.log("liriObj.processDoWhatItSays: ");
		// Show my tweets
	},

	showUsage: function () {
        console.log("Liri Usage: you must type:");
        console.log("node liri <command>");
        console.log("\twhere <command> is one of the following:");
        console.log("\tmy-tweets");
        console.log("\tspotify-this-song 'song name'");
        console.log("\tmovie-this 'movie title'");
        console.log("\tdo-what-it-says");
        console.log("\tnote: 'spotify-this-song' or 'movie-this' option should be followed by a quoted string (song or movie, resp.) ");		
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
		console.log(keys.SpotifyKeys);
		console.log("--------------------------");
		console.log("omdbKeys");
		console.log(JSON.stringify(keys.omdbKeys));
	},
} // liriObj

// Make it so liri.js can take in one of the following commands:
// my-tweets
// spotify-this-song
// movie-this
// do-what-it-says
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
            
    default:
        liriObj.showUsage();
        break;
};

