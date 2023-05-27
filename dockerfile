# Use the official Node.js base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the entire project to the container
COPY . .

# Build the Node.js project
RUN npm run build

EXPOSE 8080

# Start the application (modify this according to your project's requirements)
CMD [ "npm", "start" ]