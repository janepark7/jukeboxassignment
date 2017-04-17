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
	currentIndex: 0,

//This function will play the whole jukebox
kickoff: function() { // this is your starting point
	this.dom = {
		play: $(".jukebox-buttons-play"),
		previous: $(".jukebox-buttons-previous"),
		next: $(".jukebox-buttons-next"),
		//Hide Pause Button
		pause: $(".jukebox-buttons-pause").hide(),
		stop: $(".jukebox-buttons-stop"),
		upload: $(".jukebox-buttons-upload input"),
		songs: $(".jukebox-songs"),
	};

//Loading songs in array......

	this.addSong("./audiofiles/mama.mp3", {
		title: "Me and Your Mama",
		artist: "Childish Gambino",
	});

	this.addSong("./audiofiles/selfcontrol.mp3", {
		title: "Self Control",
		artist: "Frank Ocean",
	});

	this.addSong("./audiofiles/talktome.mp3", {
		title: "Talk to Me",
		artist: "Run the Jewels",
	});

	this.change(this.songs[0]);

// Render & Bind!

	this.render(); //look up render
	this.listenUp();
},

	listenUp: function() {
		this.dom.play.on("click", function() {
			this.play();
		}.bind(this));

		this.dom.next.on("click", function() {
			this.next(1);
		}.bind(this));

		this.dom.pause.on("click", this.pause.bind(this));

		this.dom.previous.on("click", function() {
			this.previous();
		}.bind(this));

		this.dom.stop.on("click", this.stop.bind(this));

//Upload songs onto the jukebox

		this.dom.upload.on("change", function() {
					var files = this.dom.upload.prop("files");
					console.log(files);

					for (var i = 0; i < files.length; i++) {
						var file = URL.createObjectURL(files[i]);
						this.addSong(file, {
							title: "Uploaded song",
							artist: "Unknown",
						});
					}
				}.bind(this));
			},

//Render song elements

render: function() {
	this.dom.songs.html("");
	for (var i = 0; i < this.songs.length; i++){
		var $song = this.songs[i].render();
		this.dom.songs.append($song);

		if(this.songs[i] === this.activeSong) {
			$song.addClass("isActive");
		}
	}
	//Indicate paused vs played
	this.dom.play.toggleClass("isDisabled", this.isPlaying);
	this.dom.stop.toggleClass("isDisabled", !this.isPlaying);
},

//Play function to play the jukebox
//When song is playing, the pause button will show

play: function(song) {
	console.log("this.activeSong");
	$(".jukebox-buttons-play").hide();
	$(".jukebox-buttons-pause").show();
	if (song) {
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

//When the song is paused, the play button will appear

pause: function() {
	console.log("Jukebox is paused");
	$(".jukebox-buttons-play").show();
	$(".jukebox-buttons-pause").hide();
	this.activeSong.pause();
	this.isPlaying = false;
	this.render();
	return this.activeSong;
},

//Previous button - to make the songs go backwards

previous: function() {
	if (this.activeSong) {
			this.activeSong.stop();
			this.currentIndex --;

			if (this.currentIndex < this.songs.length + 1) {
				this.currentIndex = 0;
			}
			this.activeSong = this.songs[this.currentIndex];
			this.activeSong.play();
			console.log("Jukebox is going back");
		}
	},

        /*if (this.activeSong) {
            this.activeSong.pause();
            this.currentIndex --;
            this.activeSong = this.songs[this.currentIndex];
            this.activeSong.play();
						console.log("Jukebox is going back");
        }
    },*/

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
	this.render();
	return this.activeSong;
},

next: function() {
	if (this.activeSong) {
			this.activeSong.stop();
			this.currentIndex ++;

			if (this.currentIndex > this.songs.length - 1) {
				this.currentIndex = 0;
			}
			this.activeSong = this.songs[this.currentIndex];
			this.activeSong.play();
			console.log("Jukebox is changing");
		}
	},

addSong: function(file, meta) {
	var song = new Song(file, meta);
	this.songs.push(song);
	this.render();
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

});
