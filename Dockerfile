FROM node:18-slim

# Install ffmpeg, curl, python3, pip and yt-dlp (latest)
RUN apt-get update && apt-get install -y ffmpeg curl python3-pip \
  && pip install -U yt-dlp \
  && ln -s $(which yt-dlp) /usr/local/bin/yt-dlp

# Set working directory
WORKDIR /app

# Copy files into the container
COPY . .

# Install Node dependencies
RUN npm install

# Expose the server port
EXPOSE 4000

# Start the backend server
CMD ["node", "server.js"]
