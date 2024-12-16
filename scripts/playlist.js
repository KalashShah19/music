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
// Utility functions for loading screen
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

// Fetch JSON content from GitHub repository
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
        return []; // File not found, return an empty array
    } else {
        const error = await response.json();
        throw new Error(error.message);
    }
}
async function fetchFileMetadata(url) {
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${OGtoken}`,
        },
    });

    if (response.ok) {
        return await response.json(); // Returns the full file metadata, including `sha`
    } else if (response.status === 404) {
        return null; // File not found
    } else {
        const error = await response.json();
        throw new Error(error.message);
    }
}

async function pushContent(url, content, message) {
    // Fetch the file metadata to get the `sha`
    const metadata = await fetchFileMetadata(url);
    const sha = metadata ? metadata.sha : undefined;

    const response = await fetch(url, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${OGtoken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message,
            content: btoa(content),
            branch: BRANCH,
            ...(sha && { sha }), // Include `sha` only if it exists
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }
}

// Fetch playlists
async function fetchPlaylists() {
    showLoading("Fetching playlists...");
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PLAYLISTS_FILE_PATH}`;
    try {
        const content = await fetchContent(url);
        return content;
    } catch (error) {
        alert(`Error fetching playlists: ${error.message}`);
        console.error(error);
        return [];
    } finally {
        hideLoading();
    }
}

// Save playlists
async function savePlaylists(playlists) {
    showLoading("Saving playlists...");
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PLAYLISTS_FILE_PATH}`;
    try {
        await pushContent(url, playlists, "Updated playlists");
        alert("Playlists saved successfully!");
    } catch (error) {
        alert(`Error saving playlists: ${error.message}`);
        console.error(error);
    } finally {
        hideLoading();
    }
}

// Fetch songs
async function fetchSongs() {
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
        return files.map(file => file.name);
    } catch (error) {
        alert(`Error fetching songs: ${error.message}`);
        console.error(error);
        return [];
    } finally {
        hideLoading();
    }
}

// Render playlists
async function renderPlaylists() {
    const playlists = await fetchPlaylists();
    const playlistList = document.getElementById("playlist-list");
    playlistList.innerHTML = "";

    playlists.forEach(({ playlistName }) => {
        const li = document.createElement("li");
        li.textContent = playlistName;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", async () => {
            const updatedPlaylists = playlists.filter(
                playlist => playlist.playlistName !== playlistName
            );
            await savePlaylists(updatedPlaylists);
            renderPlaylists();
        });

        li.appendChild(deleteButton);
        li.addEventListener("click", () => renderSongs(playlistName, playlists));
        playlistList.appendChild(li);
    });
}

// Render songs for a playlist
async function renderSongs(playlistName, playlists) {
    const songList = document.getElementById("song-list");
    const songs = await fetchSongs();
    const playlist = playlists.find(p => p.playlistName === playlistName);
    document.getElementById("playlist-title").textContent = playlistName;
    songList.innerHTML = "";

    songs.forEach(song => {
        const li = document.createElement("li");
        li.textContent = song;

        const toggleButton = document.createElement("button");
        toggleButton.textContent = playlist.songs.includes(song) ? "Remove" : "Add";
        toggleButton.addEventListener("click", async () => {
            const updatedPlaylists = playlists.map(p => {
                if (p.playlistName === playlistName) {
                    if (p.songs.includes(song)) {
                        p.songs = p.songs.filter(s => s !== song);
                    } else {
                        p.songs.push(song);
                    }
                }
                return p;
            });
            await savePlaylists(updatedPlaylists);
            renderSongs(playlistName, updatedPlaylists);
        });

        li.appendChild(toggleButton);
        songList.appendChild(li);
    });
}

// Add a new playlist
async function createPlaylist() {
    const playlistName = document.getElementById("playlist-name").value.trim();
    if (!playlistName) {
        alert("Please enter a playlist name.");
        return;
    }

    const playlists = await fetchPlaylists();
    if (playlists.some(p => p.playlistName === playlistName)) {
        alert("Playlist already exists.");
        return;
    }

    playlists.push({ playlistName, songs: [] });
    await savePlaylists(playlists);
    renderPlaylists();
}

// Initialize the page
(async () => {
    document.getElementById("create-playlist").addEventListener("click", createPlaylist);
    await renderPlaylists();
})();

//#endregion