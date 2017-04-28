/* globals $, SC */

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

//	This function will play the whole jukebox

		kickoff: function() { // this is your starting point

//	 Starting the SoundCloud API

		SC.initialize({ client_id: "fd4e76fc67798bfa742089ed619084a6" });

//	Referring the dom elements
		this.dom = {
			play: $(".jukebox-buttons-play"),
			previous: $(".jukebox-buttons-previous"),
			next: $(".jukebox-buttons-next"),
//	Hide Pause Button
			pause: $(".jukebox-buttons-pause").hide(),
			stop: $(".jukebox-buttons-stop"),
			upload: $(".jukebox-buttons-upload input"),
			songs: $(".jukebox-songs"),
			add: $(".jukebox-buttons-add"),
			input: $(".soundcloud-input"),
			artwork: $("jukebox-songs-art"),
		};

//	These are the songs in the array from my files......

		this.addSong("./audiofiles/mama.mp3", {
			title: "Me and Your Mama",
			artist: "Childish Gambino",
			artwork: ("./images/childishgambino.jpg"),
		});

		this.addSong("./audiofiles/selfcontrol.mp3", {
			title: "Self Control",
			artist: "Frank Ocean",
			artwork: ("./images/frankocean.jpg"),
		});

		this.addSong("./audiofiles/talktome.mp3", {
			title: "Talk to Me",
			artist: "Run the Jewels",
			artwork: ("./images/runthejewels.jpg"),
		});

		this.addSong("https://soundcloud.com/big-black-delta/big-black-delta-side-of-the", {
			title: "Side of the Road",
			artist: "Big Black Delta",
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

//	Upload songs onto the jukebox

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

		this.dom.add.on("keypress", function() {
			var url = this.dom.input.val();
			console.log("SoundCloud is playing yo!");
			this.addSong(url);
		}.bind(this));
			/*if (ev.key === "Enter" ) {
				var song = $(ev.currentTarget).data("song");
				this.play(song);
			}
		}.bind(this));*/
	},

//	Render song elements

	render: function() {
		this.dom.songs.html("");
		for (var i = 0; i < this.songs.length; i++){
			var $song = this.songs[i].render();
			this.dom.songs.append($song);

		if(this.songs[i] === this.activeSong) {
			$song.addClass("isActive");
		}
		}
//	Indicate paused vs played
		this.dom.play.toggleClass("isDisabled", this.isPlaying);
		this.dom.stop.toggleClass("isDisabled", !this.isPlaying);
	},

//	Play function to play the jukebox
//	When song is playing, the pause button will show

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

//	When the song is paused, the play button will appear

	pause: function() {
		console.log("Jukebox is paused");
		$(".jukebox-buttons-play").show();
		$(".jukebox-buttons-pause").hide();
		this.activeSong.pause();
		this.isPlaying = false;
		this.render();
		return this.activeSong;
	},

//	Previous button - to make the songs go backwards

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

//	Stop songs
	stop: function() {
		console.log('STOPPING');
		this.activeSong.stop();
		console.log("Jukebox is stopped");
	},

//	Change the songs as they are active
	change: function(song) {
		if (this.activeSong) {
			this.activeSong.stop();
		}
		this.activeSong = song;
		this.render();
		return this.activeSong;
	},

//	Next function - to skip songs
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

//	Adding songs in the array
	addSong: function(file, meta) {
				var song;
				console.log(file);
				if (file.indexOf("soundcloud.com") !== -1) {
					song = new SoundCloudSong(file, meta);
				}
				else {
					song = new FileSong(file, meta);
				}
				this.songs.push(song);

				//var $song = song.render();
				//this.dom.songs.append($song);
				this.render();
				return song;
			},

		/*= new Song(file, meta);
		this.songs.push(song);
		this.render();
		return song;
	},*/
};

/**
* SONG CLASS
*/

class Song {

	//Creating a new song

		constructor() {
			this.file = null;
			this.meta = {};
			this.audio = null;
			this.$song = $('<div class="jukebox-songs-song"></div>');
			$('.jukebox-songs').append(this.$song);
			this.$song.data("song", this);
			//this.file = file;
			//this.audio = new Audio(file);
		}

		render() {
			this.$song.html("");
			this.$song.append('<img class="artwork" src="' + this.meta.artwork + '" />');
			this.$song.append('<div class="jukebox-songs-song-art"></div>');
			this.$song.append('<div class="jukebox-songs-song-title">' + this.meta.title + '</div>');
			this.$song.append('<div class="jukebox-songs-song-title">' + this.meta.artist + '</div>');
			return this.$song;
		}

		//	Play Song
		play() {
			this.audio.play();
		}
		// Pause Song
		pause() {
			this.audio.pause();
		}
		//	Stop Song
		stop() {
			this.audio.pause();
			this.audio.currentTime = 0;
		}

	}

/**
	* FileSong Class
	*/

	class FileSong extends Song {

		constructor(file, meta) {
			super(file);
			this.file = file;
			this.meta = meta || {
				title: "Unknown title",
				artist: "Unknown artist",
			};
			this.audio = new Audio(file);
		}
}

/**
*  SoundCloudSong Class
*/


	class SoundCloudSong extends Song {
		constructor(url){
			super();
			SC.resolve(url)
			.then(function(song) {
				this.meta = {
					title: song.title,
					artist: song.user.username,
					artwork: song.artwork_url,
				};
				console.log(this.meta);
				return song;
			}.bind(this))
			.then(function(song) {
				var uri = song.uri + "/stream?client_id=fd4e76fc67798bfa742089ed619084a6";
				this.audio = new Audio(uri);
				console.log(uri);
			}.bind(this))
			.then(function() {
				this.render();
			}.bind(this));
		}
	}

//	This will play the entire Jukebox
$(document).ready(function() {
	Jukebox.kickoff();
});
