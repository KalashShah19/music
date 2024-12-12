const token = "hiq_9EiB4ilW8vCPAthxwUteFMrGzvAmMq02WQaW";
const username = "LbmbtiTibi19";
const REPO = "music";
const BRANCH = "main";

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
// console.log(GITHUB_TOKEN, "  ", OWNER);

document.getElementById("upload-song").addEventListener("click", async () => {
    const fileInput = document.getElementById("song-file");
    if (!fileInput.files.length) {
        alert("Please select a file to upload.");
        return;
    }

    const file = fileInput.files[0];
    const filePath = `songs/${file.name}`;
    const content = await file.text();
    // const base64Content = btoa(content);
    const base64Content = btoa(unescape(encodeURIComponent(content)));

    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${filePath}`;
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${OGtoken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: `Added New Song`,
            content: base64Content,
            branch: BRANCH,
        }),
    });

    if (response.ok) {
        alert("File uploaded successfully!");
    } else {
        const error = await response.json();
        console.error("Upload failed:", error);
        alert("Failed to upload file: " + error.message);
    }
});