const token = "hiq_9EiB4ilW8vCPAthxwUteFMrGzvAmMq02WQaW";
const username = "LbmbtiTibi19";
const REPO = "music";
const BRANCH = "main";
const FILE_PATH = "resources/playlists.json";

function shiftString(text, shift) {
    return text.split('').map(char => {
        if (char.match(/[a-z]/i)) {
            const isUpperCase = char === char.toUpperCase();
            const base = isUpperCase ? 'A'.charCodeAt(0) : 'a'.charCodeAt(0);
            const shiftedChar = String.fromCharCode(((char.charCodeAt(0) - base + shift + 26) % 26) + base);
            return shiftedChar;
        }
        return char;
    }).join('');
}

var OGtoken = shiftString(token, -1);
var OWNER = shiftString(username, -1);

const PLAYLISTS_FILE_PATH = "resources/playlists.json";
const SONGS_FOLDER_PATH = "songs/";

function showLoading(message) {
    let loadingScreen = document.getElementById("loading-screen");
    if (!loadingScreen) {
        loadingScreen = document.createElement("div");
        loadingScreen.id = "loading-screen";
        loadingScreen.style.position = "fixed";
        loadingScreen.style.top = "0";
        loadingScreen.style.left = "0";
        loadingScreen.style.width = "100%";
        loadingScreen.style.height = "100%";
        loadingScreen.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        loadingScreen.style.color = "#fff";
        loadingScreen.style.display = "flex";
        loadingScreen.style.justifyContent = "center";
        loadingScreen.style.alignItems = "center";
        loadingScreen.style.zIndex = "1000";
        document.body.appendChild(loadingScreen);
    }
    loadingScreen.textContent = message;
    loadingScreen.style.display = "flex";
}

function hideLoading() {
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
        loadingScreen.style.display = "none";
    }
}

const songs = [];
const playlists = [];
let currentIndex = 0;
let currentPlaylist = null;

const audioPlayer = document.getElementById("audio-player");
const songInfo = document.getElementById("current-song");

function loadSong(index) {
    const song = songs[index];
    if (song) {
        audioPlayer.src = song.url;
        songInfo.textContent = `Now playing: ${song.title}`;
    }
}

document.getElementById("play-pause").addEventListener("click", () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        document.getElementById("play-pause").textContent = "⏸ Pause";
    } else {
        audioPlayer.pause();
        document.getElementById("play-pause").textContent = "▶️ Play";
    }
});

document.getElementById("prev").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + currentPlaylist.songs.length) % currentPlaylist.songs.length;
    loadSong(currentIndex);
    audioPlayer.play();
});

document.getElementById("next").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % currentPlaylist.songs.length;
    loadSong(currentIndex);
    audioPlayer.play();
});

audioPlayer.addEventListener("ended", () => {
    currentIndex = (currentIndex + 1) % currentPlaylist.songs.length;
    loadSong(currentIndex);
    audioPlayer.play();
});

async function fetchContent(url) {
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${OGtoken}`,
        },
    });

    if (response.ok) {
        const file = await response.json();
        return JSON.parse(atob(file.content));
    } else if (response.status === 404) {
        return [];
    } else {
        const error = await response.json();
        throw new Error(error.message);
    }
}

async function fetchPlaylists() {
    // Fetch the playlists from GitHub
    showLoading("Fetching playlists...");
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PLAYLISTS_FILE_PATH}`;
    try {
        const content = await fetchContent(url);
        return content;
    } catch (error) {
        await Swal.fire({
            icon: "error",
            title: "Error Fetching Playlists",
            text: error.message,
            confirmButtonColor: "#d33",
        });
        console.error(error);
        return [];
    } finally {
        hideLoading();
    }
}

async function fetchSongs() {
    // Fetch the songs from GitHub
    showLoading("Fetching songs...");
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${SONGS_FOLDER_PATH}`;
    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${OGtoken}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to fetch songs.");
        }

        const files = await response.json();
        return files.map(file => ({
            title: file.name,
            url: file.download_url
        }));
    } catch (error) {
        alert(`Error fetching songs: ${error.message}`);
        console.error(error);
        return [];
    } finally {
        hideLoading();
    }
}

async function renderPlaylists() {
    // Render playlists on the UI
    const playlistList = document.getElementById("playlist-list");
    playlistList.innerHTML = "";

    const fetchedPlaylists = await fetchPlaylists();
    fetchedPlaylists.forEach(playlist => {
        const li = document.createElement("li");
        li.textContent = playlist.playlistName;

        li.addEventListener("click", () => {
            currentPlaylist = playlist;
            currentIndex = 0;
            loadPlaylistSongs(playlist);
        });

        playlistList.appendChild(li);
    });
}

async function loadPlaylistSongs(playlist) {
    // Load songs for a specific playlist (only play, no song list shown)
    const fetchedSongs = await fetchSongs();
    songs.length = 0;  // Reset the global songs array
    songs.push(...fetchedSongs.filter(song => playlist.songs.includes(song.title))); // Filter songs for this playlist

    document.getElementById("playlist-title").textContent = `Now Playing: ${playlist.playlistName}`;

    loadSong(currentIndex);  // Load the first song of the selected playlist
    audioPlayer.play();      // Start playing the first song
}

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

// Initialize the playlists
renderPlaylists();