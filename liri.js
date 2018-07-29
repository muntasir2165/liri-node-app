require("dotenv").config();
var keys = require('./keys');
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];
var parameter = process.argv.slice(3).join(" "); //the slice and join methods allow us to take in parameters without single/double quotes around them

switch(command) {
    case "my-tweets":
        getAndDisplayLast20Tweets();
        break;
    case "spotify-this-song":
    	console.log("Song:", parameter);
		//if the user doesn't type a song name, the program will output data for "The Sign" by Ace of Base
		if (parameter) {
			getAndDisplaySongInfo(parameter);
		} else {
			getAndDisplaySongInfo("The Sign Ace of Base");
		}
        break;
    case "movie-this":
	    if (parameter && parameter.trim()) {
		    getAndDisplayMovieInfo(parameter);
		} else {
			//if the user doesn't type a movie name, the program will output data for the movie 'Mr. Nobody.'
			getAndDisplayMovieInfo("Mr. Nobody.");
		}
    	break;
    default:
        console.log("ERROR: Please enter a valid command line argument (and parameter)");
        console.log("Valid command line arguments and parameters:");
        console.log("\t my-tweets");
        console.log("\t spotify-this-song '<song name here>'");
        console.log("\t movie-this '<movie name here>'");
}

function getAndDisplayMovieInfo(movieName) {
	var apiKey = "6de9caba";
	// run a request to the OMDB API with the movie specified
	request("http://www.omdbapi.com/?t=" + movieName + "&apikey=" + apiKey , function(error, response, body) {

	  // If the request is successful (i.e. if the response status code is 200)
	  if (!error && response.statusCode === 200) {

	    // Parse the body of the site and recover just the imdbRating
	    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
	    var movie = JSON.parse(body);
	    // console.log("movie-----", movie);
	    if (movie.Error) {
	    	console.log("Movie searched for:", movieName);
	    	console.log(movie.Error);
	    } else {
		    displayMovieInfo(movie);
		}
	  } else {
	  		console.log("Sorry, invalid request.");
	        console.log("ERROR:", error);
	  }
	});
}

function displayMovieInfo(movie) {
	var title = movie.Title;
	var year = movie.Year;
	var imdbRating = movie.imdbRating;
	var rottenPotatoesRating = "Unavailable";
	for (var i=0; i<movie.Ratings.length; i++) {
		if (movie.Ratings[i].Source === "Rotten Tomatoes") {
			rottenPotatoesRating = movie.Ratings[i].Value;
			break;
		}
	}
	var country = movie.Country;
	var language = movie.Language;
	var plot = movie.Plot;
	var actors = movie.Actors;
	console.log("Movie:", title);
	console.log("Year:", year);
	console.log("IMDB Rating:", imdbRating);
	console.log("Rotten Tomatoes Rating:", rottenPotatoesRating);
	console.log("Country:", country);
	console.log("Language:", language);
	console.log("Actors:", actors);
}

function getAndDisplaySongInfo(song) {
	spotify.search({ type: 'track', query: song, limit: 1}, function(error, data) {
	  if (error) {
	  	console.log("Sorry, invalid request.");
	    console.log('ERROR:', error);
	  } else {
		// console.log(data); 
		// console.log("---data.tracks---");
		// console.log(data.tracks);
		// console.log("---data.tracks.items[0].artists---");
		// console.log(data.tracks.items[0].artists);
		var artists = [];
		for (var i=0; i <data.tracks.items[0].artists.length; i++) {
			artists.push(data.tracks.items[0].artists[i].name);
		}
		console.log("Artist:", artists.join(" "));
		// console.log("---song: data.tracks.items[0].name---");
		console.log("Song:", data.tracks.items[0].name);
		// console.log("---preview url: data.tracks.items[0].preview_url---");
		console.log("Preview Url:", data.tracks.items[0].preview_url);
		// console.log("---album: data.tracks.items[0].album.name---");
		console.log("Album:", data.tracks.items[0].album.name);
		// console.log(data.tracks.items[0]);
	}
	});
}

function displaySongInfo() {}

function getAndDisplayLast20Tweets() {
	/*
	GET statuses/user_timeline
	Returns a collection of the most recent Tweets posted by the user
	reference: https://developer.twitter.com/en/docs/tweets/timelines/api-reference/get-statuses-user_timeline.html
	*/
	client.get('statuses/user_timeline', "", function(error, tweets, response) {
	  if (!error) {
	    // console.log(tweets);
	    var last20Tweets =  tweets.slice(0, 20);
	    displayTweetInfo(last20Tweets);
	  } else {
	  	console.log("Sorry, invalid request.");
        console.log("ERROR:", error);
	  }
	});
}

function displayTweetInfo(tweets) {
	tweets.forEach(function(tweet){
		var tweetText = tweet.text;
		var tweetTime = tweet.user.created_at;
	    console.log("Tweet:", tweetText);
	    console.log("Created at:", tweetTime);
	});
}