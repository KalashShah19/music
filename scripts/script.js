document.addEventListener("DOMContentLoaded", () => {
    const audioPlayer = document.getElementById("audio-player");
    const songList = document.getElementById("song-list");
    const playlistList = document.getElementById("playlist-list");
    const playlistTitle = document.getElementById("playlist-title");

    let playlists = {};
    let currentPlaylist = null;

    document.getElementById("create-playlist").addEventListener("click", () => {
        const playlistName = document.getElementById("playlist-name").value.trim();
        if (playlistName && !playlists[playlistName]) {
            playlists[playlistName] = [];
            renderPlaylists();
            document.getElementById("playlist-name").value = "";
        }
    });

    document.getElementById("add-song").addEventListener("click", () => {
        if (!currentPlaylist) {
            alert("Please select a playlist first.");
            return;
        }

        const songUrl = document.getElementById("song-url").value.trim();
        const songTitle = document.getElementById("song-title").value.trim();
        if (songUrl && songTitle) {
            playlists[currentPlaylist].push({ title: songTitle, url: songUrl });
            renderSongs();
            document.getElementById("song-url").value = "";
            document.getElementById("song-title").value = "";
        }
    });

    function renderPlaylists() {
        playlistList.innerHTML = "";
        Object.keys(playlists).forEach(playlistName => {
            const li = document.createElement("li");
            li.textContent = playlistName;
            li.addEventListener("click", () => {
                currentPlaylist = playlistName;
                playlistTitle.textContent = currentPlaylist;
                renderSongs();
            });
            playlistList.appendChild(li);
        });
    }

    function renderSongs() {
        songList.innerHTML = "";
        playlists[currentPlaylist].forEach((song, index) => {
            const li = document.createElement("li");
            li.textContent = song.title;

            const playButton = document.createElement("button");
            playButton.textContent = "▶️";
            playButton.addEventListener("click", () => {
                audioPlayer.src = song.url;
                audioPlayer.play();
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "❌";
            deleteButton.addEventListener("click", () => {
                playlists[currentPlaylist].splice(index, 1);
                renderSongs();
            });

            li.appendChild(playButton);
            li.appendChild(deleteButton);
            songList.appendChild(li);
        });
    }
});

document.getElementById("upload-song").addEventListener("click", () => {
    if (!currentPlaylist) {
        alert("Please select a playlist first.");
        return;
    }

    const songFileInput = document.getElementById("song-file");
    const songTitle = document.getElementById("song-title").value.trim();

    if (songFileInput.files.length > 0 && songTitle) {
        const file = songFileInput.files[0];
        const songUrl = URL.createObjectURL(file);

        playlists[currentPlaylist].push({ title: songTitle, url: songUrl });
        renderSongs();

        // Clear input fields
        document.getElementById("song-title").value = "";
        songFileInput.value = "";
    } else {
        alert("Please provide a title and select a song file.");
    }
});
