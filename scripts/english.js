const songs = [
    { title: "Sunflower", url: "./songs/Sunflower.mp3" },
    { title: "Die With A Smile", url: "./songs/Die With A Smile.mp3" },
    { title: "I Wanna Be Yours", url: "./songs/I Wanna Be Yours.m4a" },
    { title: "Until I Found You", url: "./songs/Until I Found You.mp3" },
    { title: "In The Name Of Love", url: "./songs/In The Name Of Love.mp3" },
];

let currentIndex = 0;
const audioPlayer = document.getElementById("audio-player");
const songInfo = document.getElementById("current-song");

function loadSong(index) {
    const song = songs[index];
    if (song) {
        audioPlayer.src = song.url;
	audioPlayer.type = "audio/mp3";
        songInfo.textContent = `${song.title}`;
    }
}

// Play or pause the audio
document.getElementById("play-pause").addEventListener("click", () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        document.getElementById("play-pause").textContent = "⏸ Pause";
    } else {
        audioPlayer.pause();
        document.getElementById("play-pause").textContent = "▶️ Play";
    }
});

// Load and play the previous song
document.getElementById("prev").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    loadSong(currentIndex);
    audioPlayer.play();
});

// Load and play the next song
document.getElementById("next").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % songs.length;
    loadSong(currentIndex);
    audioPlayer.play();
});

// Automatically play the next song when the current song ends
audioPlayer.addEventListener("ended", () => {
    currentIndex = (currentIndex + 1) % songs.length;
    loadSong(currentIndex);
    audioPlayer.play();
});

// Load the first song when the page loads
loadSong(currentIndex);
