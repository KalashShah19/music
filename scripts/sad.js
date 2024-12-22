
const songs = [
    { title: "Anuv Jain - JO TUM MERE HO", url: "./songs/Anuv Jain - JO TUM MERE HO.mp3" },
    { title: "Anuv Jain - HUSN", url: "./songs/Anuv Jain - HUSN.mp3" },
];

let currentIndex = 0;
const audioPlayer = document.getElementById("audio-player");
const songInfo = document.getElementById("current-song");

function loadSong(index) {
    const song = songs[index];
    if (song) {
        audioPlayer.src = song.url;
        songInfo.textContent = `Now playing: ${song.title}`;
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
