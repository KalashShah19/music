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

// Example Usage
overwriteFile("New content for the file.");