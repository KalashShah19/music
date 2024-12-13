const token = "hiq_9EiB4ilW8vCPAthxwUteFMrGzvAmMq02WQaW";
const username = "LbmbtiTibi19";
const REPO = "music";
const BRANCH = "main";
const FILE_PATH = "resources/playlists.txt";

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

// #region Overwrite Files

async function overwriteFile(content) {
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;

    try {
        // Step 1: Get the file's current `sha`
        const getResponse = await fetch(url, {
            headers: {
                Authorization: `Bearer ${OGtoken}`,
            },
        });

        if (!getResponse.ok) {
            throw new Error(`Failed to fetch file: ${getResponse.statusText}`);
        }

        const fileData = await getResponse.json();
        const sha = fileData.sha;

        // Step 2: Overwrite the file
        const base64Content = btoa(unescape(encodeURIComponent(content))); // Encode the content
        const updateResponse = await fetch(url, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${OGtoken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: "Updated playlists",
                content: base64Content,
                branch: BRANCH,
                sha, // Required to overwrite the file
            }),
        });

        if (!updateResponse.ok) {
            throw new Error(`Failed to update file: ${updateResponse.statusText}`);
        }

        const updateData = await updateResponse.json();
        console.log("File updated successfully:", updateData);
    } catch (error) {
        console.error("Error:", error);
    }
}

// overwriteFile("Kalash's PLaylist");

//#endregion

// #region PLaylist CRUD

const PLAYLISTS_FILE_PATH = "resources/playlists.json";
const SONGS_FOLDER_PATH = "songs/";

function showLoading(message) {
    const loading = document.createElement("div");
    loading.id = "loading-screen";
    loading.style.position = "fixed";
    loading.style.top = "0";
    loading.style.left = "0";
    loading.style.width = "100%";
    loading.style.height = "100%";
    loading.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    loading.style.color = "#fff";
    loading.style.display = "flex";
    loading.style.justifyContent = "center";
    loading.style.alignItems = "center";
    loading.style.zIndex = "1000";
    loading.textContent = message;
    document.body.appendChild(loading);
}

function hideLoading() {
    const loading = document.getElementById("loading-screen");
    if (loading) document.body.removeChild(loading);
}

// Fetch song names from the GitHub repository's "songs" folder
async function fetchSongs() {
    console.log("fetching songs");
    showLoading("Fetching songs...");
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${SONGS_FOLDER_PATH}`;
    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${OGtoken}`,
            },
        });

        if (response.ok) {
            const files = await response.json();
            const songs = files.map(file => file.name);
            hideLoading();
            return songs;
        } else {
            const error = await response.json();
            console.error("Failed to fetch songs:", error);
            hideLoading();
            alert("Failed to fetch songs: " + error.message);
        }
    } catch (error) {
        console.error("Error fetching songs:", error);
        hideLoading();
        alert("An unexpected error occurred.");
    }
}

// Fetch existing playlists from the repository
async function fetchPlaylists() {
    console.log("fetching songs");
    showLoading("Fetching playlists...");
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PLAYLISTS_FILE_PATH}`;
    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${OGtoken}`,
            },
        });

        if (response.ok) {
            const file = await response.json();
            const content = atob(file.content);
            hideLoading();
            return JSON.parse(content);
        } else if (response.status === 404) {
            hideLoading();
            return {}; // No playlists file exists
        } else {
            const error = await response.json();
            console.error("Failed to fetch playlists:", error);
            hideLoading();
            alert("Failed to fetch playlists: " + error.message);
        }
    } catch (error) {
        console.error("Error fetching playlists:", error);
        hideLoading();
        alert("An unexpected error occurred.");
    }
}

// Save playlists to the repository
async function savePlaylists(playlists) {
    showLoading("Saving playlists...");
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PLAYLISTS_FILE_PATH}`;
    try {
        const content = btoa(JSON.stringify(playlists, null, 2));
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${OGtoken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: "Updated playlists",
                content,
                branch: BRANCH,
            }),
        });

        if (response.ok) {
            alert("Playlists updated successfully!");
        } else {
            const error = await response.json();
            console.error("Failed to save playlists:", error);
            alert("Failed to save playlists: " + error.message);
        }
    } catch (error) {
        console.error("Error saving playlists:", error);
        alert("An unexpected error occurred.");
    } finally {
        hideLoading();
    }
}

// Add event listeners for playlist creation, deletion, and updating
document.getElementById("create-playlist").addEventListener("click", async () => {
    const playlistName = document.getElementById("playlist-name").value.trim();
    if (!playlistName) {
        alert("Please enter a playlist name.");
        return;
    }

    const playlists = await fetchPlaylists();
    if (playlists[playlistName]) {
        alert("Playlist already exists.");
        return;
    }

    playlists[playlistName] = [];
    await savePlaylists(playlists);
    renderPlaylists();
});

async function renderPlaylists() {
    const playlists = await fetchPlaylists();
    const playlistList = document.getElementById("playlist-list");
    playlistList.innerHTML = "";

    for (const playlistName in playlists) {
        const li = document.createElement("li");
        li.textContent = playlistName;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", async () => {
            delete playlists[playlistName];
            await savePlaylists(playlists);
            renderPlaylists();
        });

        li.appendChild(deleteButton);
        playlistList.appendChild(li);

        li.addEventListener("click", async () => {
            renderSongs(playlistName, playlists[playlistName]);
        });
    }
}

async function renderSongs(playlistName, playlistSongs) {
    const songList = document.getElementById("song-list");
    document.getElementById("playlist-title").textContent = playlistName;
    songList.innerHTML = "";

    const songs = await fetchSongs();
    for (const song of songs) {
        const li = document.createElement("li");
        li.textContent = song;

        const addButton = document.createElement("button");
        addButton.textContent = playlistSongs.includes(song) ? "Remove" : "Add";
        addButton.addEventListener("click", async () => {
            const playlists = await fetchPlaylists();
            if (playlists[playlistName].includes(song)) {
                playlists[playlistName] = playlists[playlistName].filter(s => s !== song);
            } else {
                playlists[playlistName].push(song);
            }
            await savePlaylists(playlists);
            renderSongs(playlistName, playlists[playlistName]);
        });

        li.appendChild(addButton);
        songList.appendChild(li);
    }
}

// Initialize the page
(async () => {
    renderPlaylists();
})();

//#endregion