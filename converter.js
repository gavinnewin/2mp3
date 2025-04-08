document.getElementById('yt-button').addEventListener('click', async () => {
    const url = document.getElementById('yt-url').value;
    const messageElement = document.getElementById('youtube-message');
    console.log(url);

    if (!url) {
        messageElement.textContent = "Please enter a valid YouTube URL!";
        messageElement.style.color = "red";
        return;
    }

    let videoId = null;

    // Extract video ID from regular YouTube URLs
    const regularUrlMatch = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:watch\?v=|v\/|e\/|embed\/|v\/video\/|.*?v%2F)([a-zA-Z0-9_-]+)(?:[?&].*)?/);
    if (regularUrlMatch) {
        videoId = regularUrlMatch[1];
    }

    // Extract video ID from shortened YouTube URLs (youtu.be)
    if (!videoId) {
        const shortUrlMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
        if (shortUrlMatch) {
            videoId = shortUrlMatch[1];
        }
    }

    // If no video ID found, show error
    if (!videoId) {
        messageElement.textContent = "Invalid YouTube URL!";
        messageElement.style.color = "red";
        return;
    }

    console.log('Extracted Video ID:', videoId);

    try {
        messageElement.textContent = "Processing...";
        messageElement.style.color = "black";

        // Step 1: Submit conversion request
        const response = await fetch(`https://youtube-to-mp315.p.rapidapi.com/download?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D${videoId}&format=mp3`, {
            method: 'POST',
            headers: {
                'x-rapidapi-key': 'a9e5410f9fmsh681fd81185455b5p1c559fjsn4d1e03467bd3',
                'x-rapidapi-host': 'youtube-to-mp315.p.rapidapi.com',
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            const errorData = await response.json(); 
            console.error("API Error Details:", errorData); 
            throw new Error(errorData.message || "Failed to submit conversion request.");
        }

        const data = await response.json();
        console.log('Conversion Response:', data);
        console.log('Conversion Response:', data.downloadUrl);
       
        if (data.downloadUrl) {
            messageElement.textContent = "MP3 ready!";
            messageElement.style.color = "green";

            // MP3 download
            const link = document.createElement('a');
            link.href = data.downloadUrl;
            link.download = "youtube-audio.mp3";
            document.body.appendChild(link);
            // link.target = "_blank";
         
            // link.click();
            // window.open(data.downloadUrl, '_blank');
        } else {
            throw new Error(data.error || 'Conversion failed.');
        }
    } catch (error) {
        messageElement.textContent = error.message;
        messageElement.style.color = "red";
    }
    
});
