const songs = [
    { title: "Tum Se", url: "./songs/Tum Se - Teri Baaton Mein Aisa Uljha Jiya.mp3" },
    { title: "Akhiyaan Gulaab", url: "./songs/Akhiyaan Gulaab - Teri Baaton Mein Aisa Uljha Jiya.mp3" },
    { title: "Hua Mai", url: "./songs/Hua Main - Animal.mp3" },
    { title: "Pehle Bhi Main", url: "./songs/Pehle Bhi Main - Animal.mp3" },
    { title: "Satranga", url: "./songs/Satranga - Animal.mp3" },
    { title: "Humraah", url: "./songs/Humraah - Malang.mp3" },
    { title: "Barbaadiyan", url: "./songs/Barbaadiyan - Shiddat.mp3" },
    { title: "Shiddat", url: "./songs/Shiddat.mp3" },
    { title: "Tainu Khabar Nahi", url: "./songs/Tainu Khabar Nahi.mp3" },
    { title: "Khoobsurat - Stree 2", url: "./songs/Khoobsurat - Stree 2.mp3" },
    { title: "Dil Se Dil Tak", url: "./songs/Dil Se Dil Tak.mp3" },
    { title: "Tere Pyaar Mein", url: "./songs/Tere Pyaar Mein - Tu Jhoothi Main Makkaar.mp3" },
    { title: "Vekh Sohneyaa", url: "./songs/Vekh Sohneyaa.mp3" },
    { title: "Jaanam", url: "./songs/Jaanam - Bad Newz.mp3" },
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
