FROM node:18-slim

# Install ffmpeg, curl, python3, pip, and yt-dlp safely
RUN apt-get update && apt-get install -y ffmpeg curl python3-pip \
  && pip install --break-system-packages -U yt-dlp \
  && ln -s $(which yt-dlp) /usr/local/bin/yt-dlp

# Set working directory
WORKDIR /app

# Copy files into container
COPY . .

# Install Node dependencies
RUN npm install

# Expose app port
EXPOSE 4000

# Start server
CMD ["node", "server.js"]
