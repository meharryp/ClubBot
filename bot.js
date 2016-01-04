/* Config */
var tChannel = "1337"; // The text channel you want the join message/errors to be sent to.
var aChannel = "1337"; // The voice channel you want to join.
var email = "club@bot.io" // Your bots email address.
var password = "hunter12" // Your bots password.
/* End of config */

var discord = require( "discord.io" ),
	yt = require( "youtube-dl" ),
	fs = require( "fs" );

var clubbot
var clubQueue = [];
var clubPlaying = false;
var clubLen = 0;

clubbot = new discord( {
	email: email,
	password: password,
	autorun: true
} );
console.log( "Connecting clubbot..." )

function PlayYoutube( url ){
	fs.stat( "temp.mp3", function( err, stats ){
		if ( !err ){
			if ( stats.isFile() ){
				fs.unlink( "temp.mp3" );
			};
		};
	} );
	setTimeout( function(){
		clubPlaying = true;
		var lastDat = Date.now();
		var datTime = Date.now();
		var name;
		var size;
		var sent = 0;
		var oldPos;
		var video = yt( url, [ "-x", "--audio-format", "mp3", "--extract-audio" ] )
		video.on( "error", function( err ){
			clubbot.sendMessage( { 
				to: tChannel,
				message: "Error: " + err
			} );
			if ( clubQueue.length - clubLen > 0 ){
				console.log( clubLen )
				PlayYoutube( clubQueue[ clubLen ] );
			} else {
				clubbot.setPresence( { 
					game: "!club <url>"
				} );
			}
			clubLen++;
		} );
		video.on( "info", function( tab ){
			size = tab.size;
			clubbot.setPresence( { 
				game: "Starting download of " + name + "..."
			} );
		} );
		yt.getInfo( url, [], function( err, info ){
			if ( !err ){
				name = info.title;
			}
		} )
		video.on( "data", function( dat ){
			lastDat = datTime;
			datTime = Date.now();
			oldPos = sent;
			sent += dat.length;
			clubbot.setPresence( {  
				game: "Downloaded " + ( sent / size * 100 ).toFixed( 1 ) + "% (ETA: " + ( sent - oldPos ) / ( datTime - lastDat )
			} );
			if ( sent == size ){
				clubbot.setPresence( { 
					game: name
				} );
			};
		} );
		video.pipe( fs.createWriteStream( "temp.mp3", { flags: 'a' } ) );
		video.on( "end", function(){
			clubbot.getAudioContext( aChannel, function( stream ){
				stream.playAudioFile( "temp.mp3" );
				stream.once( "fileEnd", function(){
					console.log( clubQueue );
					clubPlaying = false;
					if ( clubQueue.length - clubLen > 0 ){
						console.log( clubLen )
						PlayYoutube( clubQueue[ clubLen ] );
					} else {
						clubbot.setPresence( { 
							game: "!club <url>"
						} );
					};
					clubLen++;
				} );
				stream.on( "error", function(){

				} );
				clubstream = stream;
			} );
		} );
	}, 1000 );
};

setTimeout( function(){
	console.log( "Loading clubbot stage 2..." )
	clubbot.joinVoiceChannel( aChannel, function(){
		clubbot.sendMessage( { 
			to: tChannel,
			message: "ClubBot loaded! Type !club <url> to request a song. (can be soundcloud/youtube, others are supported but use at your own risk)"
		} );
		clubbot.sendMessage( { 
			to: tChannel,
			message: "Made by meharryp (http://github.com/meharryp/ClubBot/)"
		} );
	} );
	clubbot.setPresence( { 
		game: "!club <url>"
	} );
	clubbot.on( "message", function( user, id, chanid, message ){ // this is the uglyest shit ever
		if ( message.substring( 0, 5 ) == "!club" ){
			console.log( "Requesting song..." );
			var vid = message.replace( "!club ", "" );
			console.log( vid )
			if ( vid == "stop" ){
				clubstream.stopAudioFile();
				return;
			};
			if ( vid == "next" ){
				clubstream.stopAudioFile();
				return;
			}
			if ( vid == "back" ){
				clubLen--;
				clubstream.stopAudioFile();
				return;
			}
			if ( clubPlaying ){
				console.log( vid );
				clubQueue.push( vid );
				console.log( clubQueue );
				clubbot.sendMessage( { 
					to: tChannel,
					message: "Song requested! The current queue length is " + ( clubQueue.length - clubLen ) + "."
				} );
			} else {
				PlayYoutube( vid );
			};
		};
	} );
}, 1000 );
