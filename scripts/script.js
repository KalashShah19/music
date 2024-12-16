const GITHUB_TOKEN = ""; // Replace with your token
const OWNER = "KalashShah19"; // Replace with your GitHub username
const REPO = "music"; // Replace with your repository name
const BRANCH = "main"; // Replace with the branch name

document.getElementById("uploadButton").addEventListener("click", async () => {
    const fileInput = document.getElementById("fileInput");
    if (!fileInput.files.length) {
        alert("Please select a file to upload.");
        return;
    }

    const file = fileInput.files[0];
    const filePath = file.name;
    const content = await file.text(); // Read the file as text
    const base64Content = btoa(content); // Convert to Base64

    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${filePath}`;
    const response = await fetch(url, {
        method: "PUT",
        headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        message: `Add ${file.name}`,
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
