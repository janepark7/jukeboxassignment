/* globals $ */

/**
* JUKEBOX SINGLETON
*/
var Jukebox = {
	songs: [],
	activeSong: null,
	volume: 100,
	isPlaying: false,
	dom: {},

//This function will play the whole jukebox
kickoff: function() { // this is your starting point
	this.dom = {
		play: $(".jukebox-buttons-play"),
		pause: $(".jukebox-buttons-pause"),
		stop: $(".jukebox-buttons-stop"),
		next: $(".jukebox-buttons-next"),
		mute: $(".jukebox-buttons-mute"),
		songs: $(".jukebox-songs"),
	};

//Loading songs......

	this.addSong("./audiofiles/mama.mp3", {
		title: "Me and Your Mama",
		artist: "Childish Gambino",
	});

	this. addSong("./audiofiles/selfcontrol.mp3", {
		title: "Self Control",
		artist: "Frank Ocean",
	});

	this.change(this.songs[0]);

// Render & Bind!

	this.render(); //look up render
	this.hear();
},

	hear: function() {
		this.dom.play.on("click", function() {

			if (this.isPlaying) {
				this.pause();
			}
			else {
				this.play();
			}
		}.bind(this));

		this.dom.mute.on("click", function () {
			this.setVolume(0);
		}.bind(this));

		this.dom.next.on("click", function() {
			this.skip(1);
		}.bind(this));

		this.dom.pause.on("click", this.pause.bind(this));

		this.dom.previous.on("click", function() {
			this.previous(-1);
		}.bind(this));

		this.dom.stop.on("click", this.stop.bind(this));

		this.dom.next.on("click", this.next.bind(this));

		this.dom.mute.on("click", function() {
			this.setVolume(0);
		}.bind(this));
	},

render: function() {
	//Render song elements - what?
	this.dom.songs.html("");
	for (var i = 0; i < this.songs.length; i++){
		var $song = this.songs[i].render();
		this.dom.songs.append($song);
//what's append
		if(this.songs[i] === this.activeSong) {
			$song.addClass("isActive");
		}
	}

	//Indicate paused vs played
	this.dom.play.toggleClass("isDisabled", this.isPlaying);
	this.dom.stop.toggleClass("isDisabled", !this.isPlaying);
},

play: function(song) {
	console.log("this.activeSong");

	if (song) {
		console.log("always true?")
		this.change(song);
	}
	if (!this.activeSong) {
		return false;
	}
	this.isPlaying = true;
	this.activeSong.play();
	this.render();
	return this.activeSong;
},

pause: function() {
	console.log("Jukebox is paused");
	this.activeSong.pause();
},

stop: function() {
	console.log('STOPPING');
	this.activeSong.stop();
	console.log("Jukebox is stopped");
},

change: function(song) {
	if (this.activeSong) {
		this.activeSong.stop();
	}
	this.activeSong = song;
},

next: function() {
	console.log("Jukebox is changing");
	this.activeSong.skip();
},

shuffle: function() {
	console.log("Jukebox is shuffling");
},

addSong: function(file, meta) {
	var song = new Song(file, meta);
	this.songs.push(song);
	return song;
},

};

/**
* SONG CLASS
*/

class Song {
	constructor(file) {
	this.file = file;
	this.audio = new Audio(file);
	}

	render() {
		return $('<div class="jukebox-songs-song">' + this.file +'</div>');
	}

//insert volume function - access this.audio

	play() {
		this.audio.play();
	}

	pause() {
		this.audio.pause();
	}

	stop() {
		this.audio.pause();
		this.audio.currentTime = 0;
	}

	}

$(document).ready(function() {
	Jukebox.kickoff();

	if (Jukebox.play()) {
		// alert("You did it!");
	}
	else {
		// alert("What happened?");
	}
});
