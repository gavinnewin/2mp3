const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 4000;

app.use(cors());

app.get("/api/download", (req, res) => {
    const videoURL = req.query.url;
    if (!videoURL) {
        return res.status(400).json({ error: "No video URL provided" });
    }

    const filename = "temp-audio.mp3";
    const filepath = path.join(__dirname, filename);
    const command = `yt-dlp.exe -x --ffmpeg-location . --audio-format mp3 --force-overwrites -o "${filename}" "${videoURL}"`;

    console.log("▶ Downloading...");

    exec(command, (err, stdout, stderr) => {
        if (err) {
            console.error("❌ yt-dlp error:", stderr);
            return res.status(500).json({ error: "Download failed." });
        }

        console.log("✅ yt-dlp finished, preparing to send...");

        // Wait to ensure ffmpeg writes file fully
        setTimeout(() => {
            if (!fs.existsSync(filepath)) {
                console.log("🚫 File does not exist at path:", filepath);
                return res.status(500).json({ error: "File not created." });
            }
        
            console.log("📦 File exists, size:", fs.statSync(filepath).size, "bytes");
        
            const stream = fs.createReadStream(filepath);
        
            stream.on("error", (streamErr) => {
                console.error("❌ Stream failed:", streamErr);
                return res.status(500).json({ error: "Failed to stream file." });
            });
        
            res.setHeader("Content-Disposition", 'attachment; filename="audio.mp3"');
            res.setHeader("Content-Type", "audio/mpeg");
        
            stream.pipe(res);
        
            res.on("finish", () => {
                console.log("✅ File sent to browser.");
                fs.unlink(filepath, () => console.log("🧹 File deleted"));
            });
        
            res.on("close", () => {
                if (!res.writableEnded) {
                    console.log("⚠️ Browser aborted download.");
                    fs.unlink(filepath, () => console.log("🧹 File deleted after abort"));
                }
            });
        }, 1500); // Increase delay slightly in case ffmpeg is slow
        
    });
});

app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
});
