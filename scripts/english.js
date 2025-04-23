const songs = [
    { title: "One Of The Girls x Good For You", url: "./songs/One Of The Girls x Good For You.mp3" },
    { title: "Good For You x One Of The Girls", url: "./songs/Good For You x One Of The Girls.mp3" },
    { title: "Good For You", url: "./songs/Good For You.mp3" },
    { title: "One Of The Girls", url: "./songs/One Of The Girls.mp3" },
    { title: "Timeless", url: "./songs/Timeless.mp3" },
    { title: "Often", url: "./songs/Often.mp3" },
    { title: "France Football Song", url: "./songs/France Football Song.mp3" },
    { title: "All The Stars", url: "./songs/All The Stars.mp3" },
    { title: "Die With A Smile", url: "./songs/Die With A Smile.mp3" },
    { title: "Lover - Taylor Swift", url: "./songs/Lover.mp3" },
    { title: "Sunflower", url: "./songs/Sunflower.mp3" },
    { title: "I Wanna Be Yours", url: "./songs/I Wanna Be Yours.m4a" },
    { title: "Dandelions", url: "./songs/Dandelions.mp3" },
    { title: "In The Name Of Love", url: "./songs/In The Name Of Love.mp3" },
    { title: "Until I Found You", url: "./songs/Until I Found You.mp3" },
];

let currentIndex = 0;
const audioPlayer = document.getElementById("audio-player");
const songInfo = document.getElementById("current-song");
const playPauseButton = document.getElementById("play-pause");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");

// Function to update the song info and audio source
function loadSong(index) {
    const song = songs[index];
    if (song) {
        audioPlayer.src = song.url;
        songInfo.textContent = song.title;
    }
}

// Play or pause the audio and toggle button text
function togglePlayPause() {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseButton.textContent = "⏸ Pause";
    } else {
        audioPlayer.pause();
        playPauseButton.textContent = "▶️ Play";
    }
}

// Change song and play the new song
function changeSong(direction) {
    currentIndex = (currentIndex + direction + songs.length) % songs.length;
    loadSong(currentIndex);
    audioPlayer.play();
    changeMetaData(currentIndex);
}

// Automatically play the next song when the current song ends
audioPlayer.addEventListener("ended", () => changeSong(1));

// Add event listeners for play/pause, next, and previous buttons
playPauseButton.addEventListener("click", togglePlayPause);
prevButton.addEventListener("click", () => changeSong(-1));
nextButton.addEventListener("click", () => changeSong(1));

// Keyboard shortcuts
function handleShortcuts(event) {
    switch (event.key) {
        case '0':  // Repeat current song
            audioPlayer.currentTime = 0;
            audioPlayer.play();
            break;
        case 'ArrowRight':  // Next song
            changeSong(1);
            break;
        case 'ArrowLeft':  // Previous song
            changeSong(-1);
            break;
        case ' ':  // Play/pause toggle
            togglePlayPause();
            break;
        case '1':  // Open Fav PLaylist
            window.location.href='index.html';
            break;
        case '2':  // Open Rap PLaylist
            window.location.href='rap.html';
            break;
        case '3':  // Open Weeknd PLaylist
            window.location.href='weeknd.html';
            break;
        case '4':  // Open English PLaylist
            window.location.href='english.html';
            break;
        case '5':  // Open Motivational PLaylist
            window.location.href='motivation.html';
            break;
        case '6':  // Open Love PLaylist
            window.location.href='love.html';
            break;
        case '7':  // Open Sad Playlist
            window.location.href='sad.html';
            break;
        case '8':  // Open Upload Page
            window.location.href='upload.html';
            break;
        default:
            break;
    }
}

// Swipe detection for touch devices
let touchStartX = 0;
let touchEndX = 0;

// Function to handle swipe gestures
function handleSwipe(event) {
    touchEndX = event.changedTouches[0].clientX;
    if (Math.abs(touchEndX - touchStartX) > 50) {
        changeSong(touchEndX > touchStartX ? 1 : -1);
    }
}

// Handle touch start
function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
}

// Add event listeners for keydown and touch events
document.addEventListener('keydown', handleShortcuts);
document.addEventListener('touchstart', handleTouchStart);
document.addEventListener('touchend', handleSwipe);

// Load and play the first song on page load
loadSong(currentIndex);

if ('mediaSession' in navigator) {
    navigator.mediaSession.setActionHandler('play', () => {
        audioPlayer.play();
    });

    navigator.mediaSession.setActionHandler('pause', () => {
        audioPlayer.pause();
    });

    navigator.mediaSession.setActionHandler('previoustrack', () => {
        // Add logic to go to the previous song
        changeSong(-1);
    });

    navigator.mediaSession.setActionHandler('nexttrack', () => {
        // Add logic to go to the next song
        changeSong(1);
    });
}

function changeMetaData(id){
    navigator.mediaSession.metadata = new MediaMetadata({
        title: songs[id].title,
        album: "English",
    });
}

let isShuffle = true; // Set to true if you want shuffle mode enabled by default
const recentSongs = []; // Stores the indices of recently played songs
const maxRecent = 5; // Number of recent songs to exclude in shuffle

// Modified changeSong function with shuffle support
function changeSong(direction) {
    if (isShuffle && direction === 1) {
        let nextIndex;
        do {
            nextIndex = Math.floor(Math.random() * songs.length);
        } while (recentSongs.includes(nextIndex));

        currentIndex = nextIndex;

        // Update recentSongs queue
        recentSongs.push(currentIndex);
        if (recentSongs.length > maxRecent) {
            recentSongs.shift(); // Remove the oldest song index
        }
    } else {
        // Normal sequential logic
        currentIndex = (currentIndex + direction + songs.length) % songs.length;
    }

    loadSong(currentIndex);
    audioPlayer.play();
    changeMetaData(currentIndex);
}

// Optional: Add a button to toggle shuffle mode
const shuffleButton = document.getElementById("shuffle-toggle");
if (shuffleButton) {
    shuffleButton.addEventListener("click", () => {
        isShuffle = !isShuffle;
        shuffleButton.textContent = isShuffle ? "🔀 Shuffle On" : "➡️ Sequential";
    });
}