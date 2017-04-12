/*globals $ */

//Jukebox Singleton

 var Jukebox = {
	 songs: [],
	 activeSong: null,
	 volume: 100,
	 isPlaying: false,
	 dom: {},

// This function will play the whole Jukebox

start: function() {
	this.dom = {
		previous: $(".jukebox-buttons-previous"),
		play1: $(".jukebox-buttons-play"),
		pause: $(".jukebox-buttons-pause"),
		stop: $(".jukebox-buttons-stop"),
		next: $(".jukebox-buttons-next"),
		mute: $(".jukebox-buttons-mute"),
	};

  var initialSong = this.addSong("./audiofiles/donald.mp3");
    this.change(initialSong);

  this.bind();
  },

  bind: function() {
    this.dom.previous.on("click", this.previous);
    this.dom.play1.on("click", this.play.bind(this));
    this.dom.pause.on("click", this.pause);
    this.dom.stop.on("click", this.stop);
    this.dom.next.on("click", this.next);
    this.dom.mute.on("click", this.mute);
  },

addSong: function() {
  var song = new Song();
  this.songs.push(song);
},

previous: function() {

},

play: function(song) {
  this.dom.play1.play();
  console.log("Jukebox is playing");
},


pause: function() {

},

stop: function() {

},

change: function(song) {
  if (this.activeSong) {
    this.activeSong.stop();
  }
  this.activeSong = song;
},

next: function(song) {
	console.log("Jukebox is next");
},

};

class Song {
	constructor (songFile) {

	}
}

$(document).ready(function() {
	Jukebox.start();
});
