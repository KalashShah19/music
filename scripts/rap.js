const songs = [
    { title: "Dhiktana Dhiktana - Mad Trip", url: "./songs/Dhiktana Dhiktana - Mad Trip.mp3" },
    { title: "Bataa De Tu - 99side", url: "./songs/Bataa De Tu - 99side.mp3" },
    { title: "Majja Ni Life - Mad Trip", url: "./songs/Majja Ni Life - Mad Trip.mp3" },
    { title: "Boom Padi Dese - Mad Trip", url: "./songs/Boom Padi Dese - Mad Trip.mp3" },
    { title: "Baap Ka Raaj - Mad Trip", url: "./songs/Baap Ka Raaj - Mad Trip.mp3" },
    { title: "Sapne - Lashcurry", url: "./songs/Sapne - Lashcurry.mp3" },
    { title: "Jaadugar - Paradox", url: "./songs/Jaadugar - Paradox.mp3" },
    { title: "Kothi bangle wali - Mad Trip", url: "./songs/Kothi bangle wali - Mad Trip.mp3" },
    { title: "Let Them Know - Mad Trip", url: "./songs/Let Them Know - Mad Trip.mp3" },
    { title: "Hum Hai Jhalle - Mad Trip", url: "./songs/Hum Hai Jhalle - Mad Trip.mp3" },
];

let currentIndex = 0;
const audioPlayer = document.getElementById("audio-player");
const songInfo = document.getElementById("current-song");

function loadSong(index) {
    const song = songs[index];
    if (song) {
        audioPlayer.src = song.url;
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
