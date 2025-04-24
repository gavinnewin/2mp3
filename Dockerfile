FROM node:18-slim

# Install yt-dlp and ffmpeg
RUN apt-get update && apt-get install -y ffmpeg curl \
  && curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
  && chmod a+rx /usr/local/bin/yt-dlp

# Set working directory
WORKDIR /app

# Copy files
COPY . .

# Install dependencies
RUN npm install

# Expose port
EXPOSE 4000

# Start server
CMD ["node", "server.js"]
