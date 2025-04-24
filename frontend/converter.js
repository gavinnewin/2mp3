window.onload = () => {
  function handleDownload(inputId, messageId) {
    const url = document.getElementById(inputId).value;
    const message = document.getElementById(messageId);

    if (!url.includes("youtube.com") && !url.includes("youtu.be") && !url.includes("tiktok.com")){
      message.textContent = "Please enter a valid YouTube or TikTok URL!";
      message.style.color = "red";
      return;
    }

    message.textContent = "Preparing your download...";
    message.style.color = "black";

    const downloadUrl = `https://twomp3.onrender.com/api/download?url=${encodeURIComponent(url)}`;
    window.open(downloadUrl, "_blank");

    message.textContent = "Download started!";
    message.style.color = "green";
  }

  document.getElementById("yt-button")?.addEventListener("click", () => {
    handleDownload("yt-url", "youtube-message");
  });

  document.getElementById("tt-button")?.addEventListener("click", () => {
    console.log("✅ TikTok button clicked");
    handleDownload("tt-url", "tiktok-message");
  });
};
